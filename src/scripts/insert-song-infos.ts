import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import _ from 'lodash';

import { Song } from '../entity/Song';
import { SongBeatmap } from '../entity/SongBeatmap';
import { SongInfo } from '../SongInfo';

const verbose = false;

// TODO: Update existing data, while respecting version changes (e.g. beatmap changed)
// TODO: Detect data discrepancies when updating

createConnection()
  .then(async (connection) => {
    const songs = getRepository(Song);

    const songInfoFile = path.resolve(process.argv[2]);
    if (!fs.existsSync(songInfoFile)) {
      console.error(`File ${songInfoFile} does not exist.`);
      process.exit(1);
    }
    const songInfos: {
      date: string;
      guid: string;
      songinfos: {
        [baseId: string]: SongInfo;
      };
      // eslint-disable-next-line @typescript-eslint/no-var-requires
    } = require(songInfoFile);

    const updatedSongs: Song[] = [];
    const updatedBeatMaps: SongBeatmap[] = [];

    for (const baseId in songInfos.songinfos) {
      if (songInfos.songinfos.hasOwnProperty(baseId)) {
        const songInfo = songInfos.songinfos[baseId];

        const [gameKey, dalcomSongId] = baseId.split('/');

        const song = await songs
          .createQueryBuilder('song')
          .innerJoinAndSelect('song.game', 'game')
          .leftJoinAndSelect('song.beatmaps', 'beatmaps')
          .addSelect([
            'song.lengthNominal',
            'song.songFilename',
            'song.beatmapFingerprint',
            'song.beatmapDateProcessed',
          ])
          .where('song.dalcom_song_id = :dalcomSongId', { dalcomSongId })
          .andWhere('game.key = :gameKey', { gameKey })
          .getOne();
        if (!song) {
          console.log(`[ERROR] no song found for '${baseId}'`);
          continue;
        }

        if (
          song.beatmapFingerprint &&
          song.beatmapFingerprint === songInfo.beatmap_fingerprint
        ) {
          if (verbose) {
            console.log(
              `Skipping ${baseId} ${song.name} (${song.album}) - already inserted`,
            );
          }
          continue;
        }

        if (
          song.beatmapFingerprint &&
          song.beatmapFingerprint !== songInfo.beatmap_fingerprint
        ) {
          console.error(
            `Song ${baseId} ${song.name} (${song.album}) - has changed, manual review required`,
          );
          continue;
        }

        if (song.beatmaps.length > 0) {
          console.error(
            `Song ${baseId} ${song.name} (${song.album}) - already has beatmaps, manual review required`,
          );
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
            if (
              song.beatmaps.find((beatmap) => beatmap.guid === songBeatmap.guid)
            ) {
              console.log(
                `Song ${baseId} ${song.name} (${song.album}) - ${songBeatmap.difficulty} - beatmap exists, skipping`,
              );
              continue;
            }

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
            beatmap.countNotesTotalRaw =
              songBeatmap.count_notes_total_raw ||
              songBeatmap.count_notes_total;
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

    const savedBeatmaps = await connection
      .getRepository(SongBeatmap)
      .save(updatedBeatMaps);
    const savedBeatmapsBySong = _.groupBy(savedBeatmaps, 'songId');
    const savedSongs = await songs.save(updatedSongs);

    for (const song of savedSongs) {
      console.log(
        `[${song.game.key}] ${song.internalSongId} ${song.album} - ${song.name}: ` +
          ((savedBeatmapsBySong[song.id] || [])
            .map(
              (beatmap) => `${beatmap.difficulty} (${beatmap.countNotesTotal})`,
            )
            .sort()
            .join(', ') || 'No beatmaps?'),
      );
    }

    console.log(
      `Done. ${savedBeatmaps.length} beatmaps for ${savedSongs.length} songs.`,
    );
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.abort();
  });
