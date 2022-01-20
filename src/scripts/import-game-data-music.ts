import { writeFileSync } from 'fs';
import { HTTPError } from 'got';
import { Dictionary } from 'lodash';
import { createConnection, getRepository } from 'typeorm';
import { GroupData, LocaleData, MajorGroupData, MusicData } from '../definitions/data/gameinfo';
import { Artist } from '../entity/Artist';
import { Song } from '../entity/Song';
import { SongBeatmap } from '../entity/SongBeatmap';
import { SuperstarGame } from '../entity/SuperstarGame';
import { loadGamedataForMusicImport, processSongData } from '../importers/music';

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

    // const music = musicdata.slice(0, 1);
    // for (const songdata of music) {
    //   const { songEntity } = await processSongData(gamedataVersion, urlsVersion, songdata, getLocaleString, game, groups, majorgroups, Songs, SongBeatmaps, Artists);
    //   console.log(songEntity);
    //   // console.log(inspect(streamMap, false, null));
    //   // console.log(song, songEntity);
    //   // process.exit();
    // }

    const processedMusic$ = musicdata.map(songdata =>
      processSongData(
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
      ).then(({ songEntity }) => songEntity),
    );
    const processedMusic = await Promise.all(processedMusic$);
    const logTimestamp = new Date().toISOString().replace(/:/g, '-');
    console.log(processedMusic);
    console.log(logTimestamp);
    writeFileSync(
      __dirname + `/../../log-music-import-${logTimestamp}-${gameKey}-${gamedataVersion}.json`,
      JSON.stringify({ processedMusic }, null, 2),
    );
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
