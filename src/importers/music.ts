import getAudioDurationInSeconds from 'get-audio-duration';
import { cloneDeep, Dictionary, keyBy } from 'lodash';
import { basename } from 'path';
import { getRepository } from 'typeorm';
import { ArchiveAssetResult, ArchiveAssetResultOk, BaseApiResponse } from '../api';
import { api, apiConfig, fetchAllGameData } from '../backend-interface';
import { GroupData, MajorGroupData, MusicData } from '../definitions/data/gameinfo';
import { Artist } from '../entity/Artist';
import { Song } from '../entity/Song';
import { SongBeatmap } from '../entity/SongBeatmap';
import { SongBeatmapContents } from '../entity/SongBeatmapContents';
import { SuperstarGame } from '../entity/SuperstarGame';
import { generate_guid } from '../guid';
import { Beatmap, parseBeatmap, sliderStart } from '../seq';
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
export const downloadDataKeys = [...beatmapKeys, 'sound', 'previewSound', 'album', 'image'];
export const keyDifficultyMap = {
  seqEasy: Difficulty.Easy,
  seqNormal: Difficulty.Normal,
  seqHard: Difficulty.Hard,
};

export async function loadGamedataForMusicImport(gameKey: string, version: string) {
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
    (
      | {
          gameAssetInfo: ArchiveAssetResultOk;
          stream: Buffer;
          beatmap: Beatmap | undefined;
          audioLength: number | undefined;
          fingerprint: string;
          basename: string;
        }
      | undefined
    ),
  ]
> {
  return async key => {
    const fileCode = songdata[key];
    if (typeof fileCode !== 'number') {
      return [key, undefined];
    }
    const gameAssetInfoResponse = await client.post<BaseApiResponse<ArchiveAssetResult>>(
      `/v1/${gameKey}/gamedata/urls/${gamedataVersion}/${urlsVersion}/archiveAsset/${fileCode}`,
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
        basename: basename(gameAssetInfoResponse.data.fileEntity.key),
      },
    ];
  };
}

export interface ProcessedSongData {
  songEntity: Song;
  beatmaps: SongBeatmap[];
  artist: Artist;
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
  SongBeatmapContentsR = getRepository(SongBeatmapContents),
  Artists = getRepository(Artist),
  client: typeof api = api,
): Promise<ProcessedSongData> {
  const fileStreams$ = await Promise.all(
    downloadDataKeys.map(handleStreamDownload(game.key, gamedataVersion, urlsVersion, songdata, client)),
  );
  const streamMap: Dictionary<{
    stream: Buffer;
    gameAssetInfo: { uri: string };
    beatmap?: Beatmap;
    audioLength?: number;
    fingerprint: string;
    basename: string;
  }> = Object.fromEntries(fileStreams$.filter(([, stream]) => stream !== undefined));

  const song: ExtendedMusicData = cloneDeep(songdata) as unknown as ExtendedMusicData;
  song.albumName = getLocaleString(songdata.albumName);
  song.releaseDate = new Date(song.releaseDate); //  || songdata.releaseAt
  song.localeName = getLocaleString(songdata.localeName);
  song.localeDisplayGroupName = getLocaleString(songdata.localeDisplayGroupName);

  let songEntity = await Songs.createQueryBuilder('song')
    .innerJoin('song.game', 'game')
    .leftJoinAndSelect('song.beatmaps', 'beatmaps')
    .leftJoinAndSelect('beatmaps.data', 'data')
    .where('game.key = :gameKey AND song.internalSongId = :internalSongId', {
      gameKey: game.key,
      internalSongId: songdata.code,
    })
    .addSelect('song.meta')
    .getOne();

  const artist = await getGroupFromData(game, groups[songdata.groupData], majorgroups, getLocaleString, Artists);

  if (songEntity) {
    console.log(`Song: Song '${song.localeName}' exists as '${songEntity.name}' (${songEntity.guid})`);
    let existsChanged = false;

    if (!songEntity.artistId) {
      songEntity.artistId = artist.id;
      songEntity.artist = artist;
    }

    const updateSongInfo = <K extends keyof Song>(key: K, v: any) => {
      songEntity.meta = {
        ...(songEntity.meta || {}),
        ['old' + key.slice(0, 1).toUpperCase() + key.slice(1)]: songEntity[key],
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

    const existsChangedLabel = existsChanged ? 'exists changed' : 'not changed';
    console.log(`Song: Updated song '${songEntity.name}' (${songEntity.guid}): ${existsChangedLabel}`);
  } else {
    songEntity = Songs.create({
      album: song.localeDisplayGroupName,
      name: song.localeName,
      internalSongId: String(song.code),
      ingame: 1,
      songFilename: Object.values(streamMap).find(x => x.beatmap)?.beatmap?.filename,
      gameId: game.id,
      dateReleasedWorld: song.releaseDate,
      beatmaps: [],
      guid: generate_guid(),
      artist,
    });
    console.log(`Song: Creating song ${song.localeName} (${songEntity.guid})`);
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
  songEntity.audioUrl = streamMap.sound.gameAssetInfo.uri;
  songEntity.audioPreviewUrl = streamMap.previewSound.gameAssetInfo.uri;
  songEntity.imageUrl = streamMap.album.gameAssetInfo.uri;
  songEntity.imageBackgroundUrl = streamMap.image.gameAssetInfo.uri;

  const beatmaps: SongBeatmap[] = [];

  const songBeatmaps = keyBy(songEntity.beatmaps, 'difficulty');
  for (const beatmapKey of beatmapKeys) {
    const difficultyName = difficultyNames[keyDifficultyMap[beatmapKey]];
    const beatmap = streamMap[beatmapKey]?.beatmap;

    if (!beatmap) {
      console.log(`Beatmap: No beatmap for ${beatmapKey}`);
      continue;
    }

    let songBeatmap = songBeatmaps[difficultyName];
    if (!songBeatmap) {
      songBeatmap = SongBeatmaps.create({
        difficulty: difficultyName,
        songId: songEntity.id,
        beatmapFilename: streamMap[beatmapKey].basename,
        difficultyId: keyDifficultyMap[beatmapKey],
        beatmapDateProcessed: new Date(),
        countNotesTotal: beatmap.notes.length,
        countNotesTotalRaw: beatmap.noteCountRaw,
        countSlidersNocombo: beatmap.notes.filter(n => n.type === 'slider' && sliderStart.includes(n.typeID)).length,
        countNotesNocombo: beatmap.notes.filter(n => n.type === 'tap' || sliderStart.includes(n.typeID)).length,
        countSlidersTotal: beatmap.notes.filter(n => n.type === 'slider').length,
        countTaps: beatmap.notes.filter(n => n.type === 'tap').length,
        beatmapFingerprint: streamMap[beatmapKey].fingerprint,
        indexBeatMax: Math.max(...beatmap.notes.map(n => n.beat)),
        indexBeatMin: Math.min(...beatmap.notes.map(n => n.beat)),
        guid: generate_guid(),
      });
    }
    songBeatmap.beatmapFilename = streamMap[beatmapKey].basename;
    songBeatmap.seqUrl = streamMap[beatmapKey].gameAssetInfo.uri;

    if (!songBeatmap.data) {
      console.log(`Beatmap: No data for ${beatmapKey}`);
      songBeatmap.data = SongBeatmapContentsR.create({
        id: songBeatmap.id,
        beatmapDateProcessed: new Date(),
        beatmapFingerprint: streamMap[beatmapKey].fingerprint,
        parserVersion: beatmap.seqParserVersion,
        data: beatmap,
        meta: {
          fileUrl: streamMap[beatmapKey].gameAssetInfo.uri,
        },
        guid: generate_guid(),
      });
    }

    beatmaps.push(songBeatmap);
    songBeatmaps[difficultyName] = songBeatmap;
  }

  return { songEntity, beatmaps, artist };
}
