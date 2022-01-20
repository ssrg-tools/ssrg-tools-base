import getAudioDurationInSeconds from 'get-audio-duration';
import { cloneDeep, Dictionary, keyBy } from 'lodash';
import { getRepository } from 'typeorm';
import { ArchiveAssetResult, ArchiveAssetResultOk, BaseApiResponse } from '../api';
import { api, apiConfig, fetchAllGameData } from '../backend-interface';
import { GroupData, MajorGroupData, MusicData } from '../definitions/data/gameinfo';
import { Artist } from '../entity/Artist';
import { Song } from '../entity/Song';
import { SongBeatmap } from '../entity/SongBeatmap';
import { SuperstarGame } from '../entity/SuperstarGame';
import { generate_guid } from '../guid';
import { Beatmap, parseBeatmap } from '../seq';
import { Difficulty, difficultyNames } from '../types';
import { getGroupFromData } from './group';

interface ExtendedMusicData
  extends Omit<MusicData, 'albumName' | 'releaseDate' | 'localeName' | 'localeDisplayGroupName'> {
  albumName: string;
  releaseDate: Date;
  localeName: string;
  localeDisplayGroupName: string;
}

export const beatmapKeys = ['seqEasy', 'seqNormal', 'seqHard'];
export const downloadDataKeys = [...beatmapKeys, 'sound'];
export const keyDifficultyMap = {
  seqEasy: Difficulty.Easy,
  seqNormal: Difficulty.Normal,
  seqHard: Difficulty.Hard,
};

export async function loadGamedataForMusicImport(
  gameKey: string,
  version: string,
): ReturnType<typeof fetchAllGameData> {
  return fetchAllGameData(gameKey, version, [
    'artistdata',
    'localedata',
    // 'urls',
    'musicdata',
    'groupdata',
    'majorgroupdata',
  ]);
}

export function handleStreamDownload(
  gameKey: string,
  gamedataVersion: number,
  urlsVersion: number,
  songdata: MusicData,
  client: typeof api = api,
): (
  value: string,
  index: number,
  array: string[],
) => Promise<
  [
    string,
    {
      gameAssetInfo: ArchiveAssetResultOk;
      stream: Buffer;
      beatmap: Beatmap | undefined;
      audioLength: number | undefined;
      fingerprint: string;
    },
  ]
> {
  return async key => {
    const gameAssetInfoResponse = await client.post<BaseApiResponse<ArchiveAssetResult>>(
      `/v1/${gameKey}/gamedata/urls/${gamedataVersion}/${urlsVersion}/archiveAsset/${songdata[key]}`,
    );

    if (gameAssetInfoResponse.data.result === 'error') {
      throw new Error(String(gameAssetInfoResponse));
    }

    const stream = await client.getRaw(gameAssetInfoResponse.data.uri);
    let beatmap: Beatmap | undefined;
    let audioLength: number;

    if (beatmapKeys.includes(key)) {
      beatmap = parseBeatmap(stream);
    }

    if (key === 'sound') {
      audioLength = await getAudioDurationInSeconds(apiConfig.endpoint + gameAssetInfoResponse.data.uri);
    }

    return [
      key,
      {
        gameAssetInfo: gameAssetInfoResponse.data,
        stream,
        beatmap,
        audioLength,
        fingerprint: gameAssetInfoResponse.data.fileEntity.fingerprint,
      },
    ];
  };
}

export async function processSongData(
  gamedataVersion: number,
  urlsVersion: number,
  songdata: MusicData,
  getLocaleString: (code: number) => string,
  game: SuperstarGame,
  groups: Dictionary<GroupData>,
  majorgroups: Dictionary<MajorGroupData>,
  Songs = getRepository(Song),
  SongBeatmaps = getRepository(SongBeatmap),
  Artists = getRepository(Artist),
  client: typeof api = api,
) {
  const fileStreams$ = await Promise.all(
    downloadDataKeys.map(handleStreamDownload(game.key, gamedataVersion, urlsVersion, songdata, client)),
  );
  const streamMap: Dictionary<{
    stream: Buffer;
    gameAssetInfo: { uri: string };
    beatmap?: Beatmap;
    audioLength?: number;
    fingerprint: string;
  }> = Object.fromEntries(fileStreams$);

  const song: ExtendedMusicData = cloneDeep(songdata) as unknown as ExtendedMusicData;
  song.albumName = getLocaleString(songdata.albumName);
  song.releaseDate = new Date(song.releaseDate); //  || songdata.releaseAt
  song.localeName = getLocaleString(songdata.localeName);
  song.localeDisplayGroupName = getLocaleString(songdata.localeDisplayGroupName);

  let songEntity = await Songs.createQueryBuilder('song')
    .innerJoin('song.game', 'game')
    .leftJoinAndSelect('song.beatmaps', 'beatmaps')
    .where('game.key = :gameKey AND song.internalSongId = :internalSongId', {
      gameKey: game.key,
      internalSongId: songdata.code,
    })
    .getOne();

  const artist = await getGroupFromData(game, groups[songdata.groupData], majorgroups, getLocaleString, Artists);

  if (songEntity) {
    console.log(`Song ${song.localeName} exists as ${songEntity.name} (${songEntity.guid})`);
    let existsChanged = false;

    if (!songEntity.artistId) {
      songEntity.artistId = artist.id;
      songEntity.artist = artist;
    }

    const updateSongInfo = <K extends keyof Song>(key: K, v: any) => {
      songEntity.meta = {
        ...(songEntity.meta || {}),
        ['old' + key.slice(0, 1).toUpperCase() + key.slice(1)]: v,
      };
      songEntity[key] = v;
    };

    if (songEntity.name !== song.localeName) {
      updateSongInfo('name', song.localeName);
      existsChanged = true;
    }

    if (songEntity.album !== song.localeDisplayGroupName) {
      updateSongInfo('album', song.localeDisplayGroupName);
      existsChanged = true;
    }

    songEntity.ingame = 1;

    if (!songEntity.dateReleasedWorld) {
      songEntity.dateReleasedWorld = song.releaseDate;
      existsChanged = true;
    }

    // await Songs.save(songEntity);
    const existsChangedLabel = existsChanged ? 'exists changed' : 'not changed';
    console.log(`Updated song ${songEntity.name} (${songEntity.guid}): ${existsChangedLabel}`);
  } else {
    songEntity = Songs.create({
      album: song.localeDisplayGroupName,
      name: song.localeName,
      internalSongId: String(song.code),
      ingame: 1,
      songFilename: streamMap.seqEasy.beatmap.filename,
      gameId: game.id,
      dateReleasedWorld: song.releaseDate,
      beatmaps: [],
      guid: generate_guid(),
      artist,
    });
    console.log(`Creating song ${song.localeName} (${songEntity.guid})`);
  }

  const audioLength = streamMap.sound.audioLength;
  if (audioLength) {
    songEntity.lengthSeconds = audioLength.toString();
    songEntity.lengthNominal = (audioLength / 60).toString();
    const audioMinutes = Math.floor(audioLength / 60);
    const audioSeconds = Math.floor(audioLength % 60);
    const audioFraction = (audioLength % 1).toString().slice(2).padStart(2, '0').slice(0, 2);
    const audioMinutesF = audioMinutes.toString().padStart(2, '0');
    const audioSecondsF = audioSeconds.toString().padStart(2, '0');
    songEntity.lengthDisplay = `${audioMinutesF}:${audioSecondsF}.${audioFraction}`;
  }

  const songBeatmaps = keyBy(songEntity.beatmaps, 'difficulty');
  for (const beatmapKey of beatmapKeys) {
    const difficultyName = difficultyNames[keyDifficultyMap[beatmapKey]];
    const beatmap = streamMap[beatmapKey].beatmap;

    let songBeatmap = songBeatmaps[difficultyName];
    if (!songBeatmap) {
      songBeatmap = SongBeatmaps.create({
        difficulty: difficultyName,
        songId: songEntity.id,
        beatmapFilename: beatmap.filename,
        difficultyId: keyDifficultyMap[beatmapKey],
        beatmapDateProcessed: new Date(),
        countNotesTotal: beatmap.notes.length,
        countNotesTotalRaw: beatmap.noteCountRaw,
        countTaps: beatmap.notes.filter(n => n.type === 'tap').length,
        beatmapFingerprint: streamMap[beatmapKey].fingerprint,
        guid: generate_guid(),
      });

      songEntity.beatmaps.push(songBeatmap);
      songBeatmaps[difficultyName] = songBeatmap;
    }
  }

  return { songEntity };
}
