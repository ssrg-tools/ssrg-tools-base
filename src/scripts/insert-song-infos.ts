import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import { Song } from '../entity/Song';
import { SongBeatmap } from '../entity/SongBeatmap';

// TODO: Update existing data, while respecting version changes (e.g. beatmap changed)
// TODO: Detect data discrepancies when updating

createConnection().then(async connection => {
  const _ = require('lodash');
  const songs = getRepository(Song);

  const songInfoFile = path.resolve(process.argv[2]);
  if (!fs.existsSync(songInfoFile)) {
    console.error(`File ${songInfoFile} does not exist.`);
    process.exit(1);
  }
  const songInfos: {
    date: string,
    guid: string,
    songinfos: {
      [baseId: string]: SongInfo,
    },
  } = require(songInfoFile);

  const updatedSongs: Song[] = [];
  const updatedBeatMaps: SongBeatmap[] = [];

  for (const baseId in songInfos.songinfos) {
    if (songInfos.songinfos.hasOwnProperty(baseId)) {
      const songInfo = songInfos.songinfos[baseId];

      const [ gameKey, dalcomSongId ] = baseId.split('/');

      const song = await songs.createQueryBuilder('song')
        .innerJoin('song.game', 'game')
        .leftJoinAndSelect('song.beatmaps', 'beatmaps')
        .addSelect([ 'lengthNominal', 'songFilename', 'beatmapFingerprint', 'beatmapDateProcessed' ])
        .where('song.dalcom_song_id = :dalcomSongId', { dalcomSongId })
        .andWhere('game.key = :gameKey', { gameKey })
        .getOne()
      ;

      if (!song) {
        throw new Error(`no song found for '${baseId}'`);
      }

      if (song.beatmapFingerprint && song.beatmapFingerprint === songInfo.beatmap_fingerprint) {
        console.log(`Skipping ${baseId} ${song.name} (${song.album}) - already inserted`);
        continue;
      }

      if (song.beatmapFingerprint && song.beatmapFingerprint !== songInfo.beatmap_fingerprint) {
        console.error(`Song ${baseId} ${song.name} (${song.album}) - has changed, manual review required`);
        continue;
      }

      if (song.beatmaps.length > 0) {
        console.error(`Song ${baseId} ${song.name} (${song.album}) - already has beatmaps, manual review required`);
        continue;
      }

      song.lengthDisplay = songInfo.length_display;
      song.lengthSeconds = songInfo.length_seconds;
      song.lengthNominal = songInfo.length_nominal + '';

      song.songFilename = songInfo.dalcom_song_filename;
      song.beatmapDateProcessed = new Date(songInfo.date_processed);
      song.beatmapFingerprint = songInfo.beatmap_fingerprint;

      for (const difficultyKey in songInfo.bydifficulties) {
        if (songInfo.bydifficulties.hasOwnProperty(difficultyKey)) {
          const songBeatmap = songInfo.bydifficulties[difficultyKey];

          const beatmap = connection.getRepository(SongBeatmap).create();
          song.beatmaps.push(beatmap);
          updatedBeatMaps.push(beatmap);

          beatmap.song = song;
          beatmap.difficulty = songBeatmap.difficulty;
          beatmap.difficultyId = songBeatmap.difficulty_id;
          beatmap.beatmapFilename = songBeatmap.dalcom_beatmap_filename;
          beatmap.beatmapFingerprint = songBeatmap.beatmap_fingerprint;
          beatmap.indexBeatMin = songBeatmap.index_beat_min;
          beatmap.indexBeatMax = songBeatmap.index_beat_max;
          beatmap.countNotesTotal = songBeatmap.count_notes_total;
          beatmap.countNotesNocombo = songBeatmap.count_notes_nocombo;
          beatmap.countTaps = songBeatmap.count_taps;
          beatmap.countSlidersNocombo = songBeatmap.count_sliders_nocombo;
          beatmap.countSlidersTotal = songBeatmap.count_sliders_total;
          beatmap.beatmapDateProcessed = new Date(songBeatmap.date_processed);
          beatmap.guid = songBeatmap.guid;
        }
      }

      updatedSongs.push(song);
    }
  }

  // console.log(updatedSongs);
  console.log(await connection.getRepository(SongBeatmap).save(updatedBeatMaps));
  console.log(await songs.save(updatedSongs));
  console.log('Done.');
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});

interface SongInfo
{
  length_display: string;
  length_seconds: string;
  length_nominal: number;
  dalcom_song_id: string;
  dalcom_song_filename: string;
  date_processed: string;
  beatmap_fingerprint: string;
  bydifficulties: {
    [difficulty: string]: {
      difficulty: string,
      difficulty_id: string,
      dalcom_beatmap_filename: string,
      beatmap_fingerprint: string,
      index_beat_min: number,
      index_beat_max: number,
      count_notes_total: number,
      count_notes_nocombo: number,
      count_taps: number,
      count_sliders_nocombo: number,
      count_sliders_total: number,
      date_processed: string,
      guid: string,
    },
  };
}
