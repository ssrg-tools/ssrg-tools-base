import { writeFile } from 'fs/promises';
import { HTTPError } from 'got';
import { Dictionary } from 'lodash';
import { createConnection, getRepository, UpdateValuesMissingError } from 'typeorm';
import { GroupData, LocaleData, MajorGroupData, MusicData } from '../definitions/data/gameinfo';
import { Artist } from '../entity/Artist';
import { Song } from '../entity/Song';
import { SongBeatmap } from '../entity/SongBeatmap';
import { SuperstarGame } from '../entity/SuperstarGame';
import { loadGamedataForMusicImport, ProcessedSongData, processSongData } from '../importers/music';

const gameKey = process.argv[2];
if (!gameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
const version = process.argv[3] || 'latest';

async function main() {
  await createConnection();
  try {
    const { overview, contextMap, contextMapByCode } = await loadGamedataForMusicImport(gameKey, version);
    console.log('All game data loaded.');

    const gamedataVersion = overview.version;
    const musicdata = contextMap.musicdata as MusicData[];
    const locales = contextMapByCode.localedata as Dictionary<LocaleData>;
    // const urls = contextMapByCode.urls as Dictionary<URLs>;
    const groups = contextMapByCode.groupdata as Dictionary<GroupData>;
    const majorgroups = contextMapByCode.majorgroupdata as Dictionary<MajorGroupData> | undefined;

    const getLocaleString = (code: number) => String(locales[code]?.enUS || locales[code]?.koKR);

    const urlsVersion = (overview.context.urls || overview.context.URLs).version;

    const Songs = getRepository(Song);
    const SongBeatmaps = getRepository(SongBeatmap);
    const SuperstarGames = getRepository(SuperstarGame);
    const Artists = getRepository(Artist);

    const game = await SuperstarGames.findOneOrFail(null, {
      where: { key: gameKey },
    });

    const processedMusic: ProcessedSongData[] = [];
    for (const songdata of musicdata) {
      const {
        songEntity: song,
        beatmaps,
        artist,
      } = await processSongData(
        gamedataVersion,
        urlsVersion,
        songdata,
        getLocaleString,
        game,
        groups,
        majorgroups,
        Songs,
        SongBeatmaps,
        Artists,
      );
      console.log(
        'Processed song:',
        song.internalSongId,
        song.id || '<no-id>',
        song.album,
        song.name,
        song.dateReleasedGame || '<no-date-game-release>',
      );
      processedMusic.push({
        songEntity: song,
        beatmaps,
        artist,
      });

      if (!artist.id) {
        console.log('Encountered new artist:', artist.name);
        await Artists.save(artist);
        song.artistId = artist.id;
        song.artist = artist;
      }

      try {
        if (!song.id) {
          process.stdout.write('Inserting new song! ');
        } else {
          process.stdout.write('Updating song! ');
        }
        await Songs.save(song);
        console.log('Saved song.');
      } catch (error) {
        if (error instanceof UpdateValuesMissingError) {
          console.log('Song not changed (UpdateValuesMissingError).');
          continue;
        }
        console.error('Error:', error);
        continue;
      }

      console.log('Saving song beatmaps...');
      for (const beatmap of beatmaps) {
        try {
          if (beatmap.id) {
            console.log(`Skipping existing ${beatmap.difficulty} beatmap!`);
            continue;
          }

          process.stdout.write('Inserting new beatmap! ');
          beatmap.songId = song.id;
          await SongBeatmaps.save(beatmap);
          console.log(
            'Saved song beatmap.',
            song.internalSongId,
            beatmap.id,
            beatmap.difficulty,
            beatmap.beatmapFilename,
          );
        } catch (error) {
          if (error instanceof UpdateValuesMissingError) {
            console.log('Song not changed.');
            continue;
          }
          console.error('Error:', error);
        }
      }
    }

    const logTimestamp = new Date().toISOString().replace(/:/g, '-');
    console.log(logTimestamp);
    await writeFile(
      __dirname + `/../../../log-music-import-${logTimestamp}-${gameKey}-${gamedataVersion}.json`,
      JSON.stringify({ processedMusic }, null, 2),
    );
    console.log('Songs saved.');
  } catch (error) {
    console.error(error);
    if (error instanceof HTTPError) {
      console.error(error.request.requestUrl);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(reason => {
    console.error(reason);
    process.abort();
  });
