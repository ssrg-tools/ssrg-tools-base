import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import _, { Dictionary } from 'lodash';

import { Song } from '../entity/Song';
import { SongInfo } from '../SongInfo';
import { SuperstarGame } from '../entity/SuperstarGame';
import { generate_guid } from '../guid';

const verbose = false;
const dryRun = true;

// tslint:disable: object-literal-key-quotes
const artistMap: Dictionary<string> = {
  'EXO*SC': 'EXO-SC',
  'EXO*K': 'EXO-K',
  'EXO*M': 'EXO-M',
  'Exo': 'EXO',
  'RV': 'Red Velvet',
  'rv': 'Red Velvet',
  'Rv': 'Red Velvet',
  'Redvelvet': 'Red Velvet',
  'Boa': 'BoA',
  'BOA': 'BoA',
  'TY': 'Taeyeon',
  'GG': 'Girls\' Generation',
  'TTS': 'Girls\' Generation-TTS',
  'CBX': 'EXO-CBX',
  'Lay': 'LAY',
  'D&E': 'Super Junior-D&E',
  'SJ': 'Super Junior',
  'SuperJunior': 'Super Junior',
  'SUV': 'SUV (SHINDONG&UV)',
  'KH': 'Kyuhyun',
  'JongHuyn': 'Jonghyun',
  'JONGHYUN': 'Jonghyun',
  'SEOHYUN': 'Seohyun',
  'Station0': 'SM Station',
  'Station': 'SM Station',
  'SmStation': 'SM Station',
  'NCT127': 'NCT 127',
  'Nct127': 'NCT 127',
  'NCTdream': 'NCT Dream',
  'NCTDREAM': 'NCT Dream',
  'Hyo': 'HYO',
  'Hyoyeon': 'HYO',
  'Key': 'KEY',
  'fx': 'f(x)',
  'Fx': 'f(x)',
  'FX': 'f(x)',
  'Sistar': 'SISTAR',
  'Cravity': 'CRAVITY',
  'MONSTAX': 'MONSTA X',
  'MX': 'MONSTA X',
  'MonstaX': 'MONSTA X',
  'Monstax': 'MONSTA X',
  'MonsterX': 'MONSTA X',
  'GC': 'Golden Child',
  'GOLDENCHILD': 'Golden Child',
  'GoldenChild': 'Golden Child',
  'RP': 'Rocket Punch',
  'Rocketpunch': 'Rocket Punch',
  'RocketPunch': 'Rocket Punch',
  'Infinite': 'INFINITE',
  'RyuSuJeong': 'Ryu Su Jeong',
  'Ryusujeong': 'Ryu Su Jeong',
  'RSJ': 'Ryu Su Jeong',
  'JSW': 'Jeong Se Woon',
  'JEONGSEWOON': 'Jeong Se Woon',
  'Itzy': 'ITZY',
  'Twice': 'TWICE',
  'Jyp': 'JYP',
  'IS': 'Irene & Seulgi',
  'NWH': 'Nam Woo Hyun',
  'JDW': 'Jang Dong Woo',
  'KSK': 'Kim Sung Kyu',
  'KimSungKyu': 'Kim Sung Kyu',
  'BrotherSu': 'BrotherSu',
  'Madclown': 'MAD CLOWN',
  'MINDU': 'MIND U',
  'MindU': 'MIND U',
  'YSW': 'YU SEUNG WOO',
  'YuseungWoo': 'YU SEUNG WOO',
  'Wjsn': 'WJSN',
  'SoYou': 'SOYOU',
  'Kwill': 'K.WILL',
  'SOYOU&MC': 'SOYOU & MAD CLOWN',
  'GF': 'GFRIEND',
  'GFriend': 'GFRIEND',
  'Gfriend': 'GFRIEND',
  'MissA': 'miss A',
  'Miss A': 'miss A',
  'Shinee': 'SHINee',
  'UKNOW': 'U-Know',
  'Yoona': 'YoonA',
  'ZHOUIMI': 'ZHOUMI',
  'TAEMIN': 'Taemin',
  'TAEYEON': 'Taeyeon',
  'TaeYeon': 'Taeyeon',
  'BEAKHYUN': 'BAEKHYUN',
  'BH': 'BAEKHYUN',
  'Superm': 'SuperM',
  'Day6': 'DAY6',
  '2pm': '2PM',
  'Got7': 'GOT7',
  'Parkjimin': 'Park Jimin',
  'PARKJIMIN': 'Park Jimin',
  'JJ': 'JJ Project',
  'jjp': 'JJ Project',
  'Jjp': 'JJ Project',
  'JUNK': 'Jun.K',
  'Suzy': 'SUZY',
  'Nakjoon': 'NakJoon',
  'J*Hope': 'J-Hope',
  'bts': 'BTS',
  'Bts': 'BTS',
};

const prepareMap: Dictionary<string> = {
  'EXO-SC': 'EXO*SC', // protect the dash
  'EXO_SC': 'EXO*SC',
  'Sehun_Chanyeol': 'EXO*SC',
  'EXO_K_': 'EXO*K_',
  'EXO_M': 'EXO*M',
  'j-hope': 'J*Hope',
  'J-Hope': 'J*Hope',
  'J_Hope': 'J*Hope',
  'JHope': 'J*Hope',
  'NCT_U': 'NCT U',
  'NCT_127': 'NCT 127',
  'NCT_Dream': 'NCT Dream',
  'BAEK_HYUN': 'BAEKHYUN',
  'KYU_HYUN': 'Kyuhyun',
  'wayv_': 'WayV_',
  'Red_velvet': 'Red Velvet',
  'Red_Velvet': 'Red Velvet',
  'U_know': 'UKNOW',
  'JANG_WOOYOUNG': 'Jang Wooyoung',
  'WOOYOUNG': 'Jang Wooyoung',
  'Baek_Ye_Rin': 'Yerin Baek',
  'BaekYeRin': 'Yerin Baek',
  'Wonder_Girls': 'Wonder Girls',
  'Wonder_Grils': 'Wonder Girls',
  'WG': 'Wonder Girls',
  'Park_Jimin': 'Park Jimin',
  'Stray_Kids': 'Stray Kids',
  'Straykids': 'Stray Kids',
  'StrayKids': 'Stray Kids',
  'sk_': 'Stray Kids_',
  'Day_6': 'DAY6',
  'JUN_K_': 'Jun.K_',
  'Baek_A_Yeon': 'Baek A Yeon',
  'Beak_A_Yeon': 'Baek A Yeon',
  'Back_A_Yeon': 'Baek A Yeon',
  'Monsta_X': 'MONSTA X',
  'MONSTA_X': 'MONSTA X',
  'Super_Junior': 'Super Junior',
  'Girls_Generation': 'Girls\' Generation',
  'Rocket_Punch': 'Rocket Punch',
  'DJ_SODA': 'DJ SODA',
  'Mad_Clown': 'MAD CLOWN',
  'Mind_U': 'MIND U',
  'Mind_u': 'MIND U',
  'Yu_Seung_Woo': 'YU SEUNG WOO',
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
        .filter(x => x)
        .join(' ')
    );

  processed[0] = (artistMap[processed[0]] || processed[0]).trim();

  if (!processed[1]) {
    processed[1] = processed[0];
    processed[0] = 'Unknown';
  }
  processed[1] = (processed[1]).trim();

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
        imageId: dalcomSongId,
        ingame: 1,
        guid: generate_guid(),
      });

      if (verbose || dryRun) {
        console.log(
          `Would insert ${game.name}/${dalcomSongId} [${newSong.album}] ${newSong.name} - from '${songInfo.dalcom_song_filename}'`);
      }
      if (!dryRun) {
        const saved = await songs.save(newSong);
        console.log(`Inserted ${gameKey}/${dalcomSongId} [${newSong.album}] ${newSong.name} - from '${songInfo.dalcom_song_filename}' - ${saved.id}-${saved.guid}`);
      }
      inserted++;
    }
  }

  console.log(`Done, inserted ${inserted} songs and skipped ${skipped} with ${errors.length} errors`, errors);
}).then(() => process.exit(0)).catch((reason) => {
  console.error(reason);
  process.abort();
});
