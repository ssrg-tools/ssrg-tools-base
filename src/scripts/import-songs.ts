import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import _ from 'lodash';

import { Song } from '../entity/Song';
import { SongInfo } from '../SongInfo';
import { SuperstarGame } from '../entity/SuperstarGame';

const verbose = false;
const dryRun = true;
const dateReleased = new Date('2020-01-01T09:00:00');

// tslint:disable: object-literal-key-quotes
const artistMap = {
  'EXO*SC': 'EXO-SC',
  'Exo': 'EXO',
  'RV': 'Red Velvet',
  'Boa': 'BoA',
  'GG': 'Girls\' Generation',
  'CBX': 'EXO-CBX',
  'D&E': 'Super Junior-D&E',
  'SEOHYUN': 'Seohyun',
  'Sistar': 'SISTAR',
  'Cravity': 'CRAVITY',
  'MONSTAX': 'Monsta X',
  'MX': 'Monsta X',
  'MonstaX': 'Monsta X',
  'Monstax': 'Monsta X',
  'MonsterX': 'Monsta X',
  'GC': 'Golden Child',
  'GOLDENCHILD': 'Golden Child',
  'GoldenChild': 'Golden Child',
  'RP': 'Rocket Punch',
  'Rocketpunch': 'Rocket Punch',
  'RocketPunch': 'Rocket Punch',
  'INFINITE': 'Infinite',
  'RyuSuJeong': 'Ryu Su Jeong',
  'Ryusujeong': 'Ryu Su Jeong',
  'RSJ': 'Ryu Su Jeong',
  'JSW': 'Jeong Se Woon',
  'JEONGSEWOON': 'Jeong Se Woon',
  'Itzy': 'ITZY',
  'Twice': 'TWICE',
  'IS': 'Irene & Seulgi',
  'NWH': 'Nam Woo Hyun',
  'JDW': 'Jang Dong Woo',
  'KSK': 'Kim Sung Kyu',
  'KimSungKyu': 'Kim Sung Kyu',
  'BrotherSu': 'BrotherSu',
  'Madclown': 'Mad Clown',
  'MINDU': 'MIND U',
  'MindU': 'MIND U',
  'YSW': 'Yu Seung Woo',
  'YuseungWoo': 'Yu Seung Woo',
  'Wjsn': 'WJSN',
  'SoYou': 'Soyou',
  'Kwill': 'K.Will',
  'SOYOU&MC': 'Soyou & Mad Clown',
  'GF': 'GFRIEND',
  'GFriend': 'GFRIEND',
  'Gfriend': 'GFRIEND',
};

const prepareMap = {
  'EXO-SC': 'EXO*SC', // protect the dash
  'NCT_127': 'NCT 127',
  'Hope.ogg': 'School OZ - 빛 (Hope) (Hidden Stage)',
  'Cover_up.ogg': 'Taeyeon_Cover Up',
  'CHEER_UP.ogg': 'Twice_Cheer Up',
  'Monsta_X': 'Monsta X',
  'MONSTA_X': 'Monsta X',
  'Super_Junior': 'Super Junior',
  'Girls_Generation': 'Girls\' Generation',
  'Rocket_Punch': 'Rocket Punch',
  'DJ_SODA': 'DJ SODA',
  'Mad_Clown': 'Mad Clown',
  'Mind_U': 'MIND U',
  'Mind_u': 'MIND U',
};

function prepOriginalFilename(originalFilename: string) {
  originalFilename = _.last(originalFilename.split('/'));
  for (const entry of Object.entries(prepareMap)) {
    originalFilename = originalFilename.replace(entry[0], entry[1]);
  }
  return originalFilename.replace(/-(.+)$/, '_$1');
}

function processSongName(input: string) {
  const processed = input
    .replace('.ogg', '')
    .split(/_(.+)/)
    .map(part =>
      part.replace(/_+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .map(word => word.trim())
        .join(' ')
    );

  processed[0] = artistMap[processed[0]] || processed[0];

  return processed;
}

function parseSongName(originalFilename: string) {
  originalFilename = prepOriginalFilename(originalFilename);
  return processSongName(originalFilename);
}

createConnection().then(async connection => {
  if (dryRun) {
    console.log('Dry run enabled!');
  }
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

  const games = _.keyBy(await getRepository(SuperstarGame).find(), 'key');

  let inserted = 0;
  let skipped = 0;
  const errors = [];

  for (const baseId in songInfos.songinfos) {
    if (songInfos.songinfos.hasOwnProperty(baseId)) {
      const songInfo = songInfos.songinfos[baseId];

      const [gameKey, dalcomSongId] = baseId.split('/');

      const existingSong = await songs.createQueryBuilder('song')
        .innerJoin('song.game', 'game')
        .leftJoinAndSelect('song.beatmaps', 'beatmaps')
        .addSelect(['song.lengthNominal', 'song.songFilename', 'song.beatmapFingerprint', 'song.beatmapDateProcessed'])
        .where('song.dalcom_song_id = :dalcomSongId', { dalcomSongId })
        .andWhere('game.key = :gameKey', { gameKey })
        .getOne()
        ;

      if (existingSong) {
        if (verbose) {
          console.log(`Skipping ${gameKey}/${dalcomSongId} [${existingSong.album}] ${existingSong.name} - already inserted`);
        }
        skipped++;
        continue;
      }

      const [album, name] = parseSongName(songInfo.dalcom_song_filename);
      const game = games[gameKey];
      if (!game || !name || !album) {
        const errorText = `Could not insert song for ${gameKey}/${dalcomSongId} [${album}] ${name} - from '${songInfo.dalcom_song_filename}'`;
        console.error(errorText);
        errors.push(errorText);
        continue;
      }

      const newSong = songs.create({
        name,
        album,
        game,
        internalSongId: dalcomSongId,
        ingame: 1,
        dateReleasedGame: dateReleased,
        dateReleasedWorld: dateReleased,
      });

      if (verbose || dryRun) {
        console.log(
          `Would insert ${game.name}/${dalcomSongId} [${newSong.album}] ${newSong.name} - from '${songInfo.dalcom_song_filename}'`);
      }
      if (!dryRun) {
        console.log(await songs.save(newSong));
      }
      inserted++;
    }
  }

  console.log(`Done, inserted ${inserted} songs and skipped ${skipped} with ${errors.length} errors`, errors);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
