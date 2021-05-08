/* eslint-disable prettier/prettier */
import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import _, { Dictionary } from 'lodash';

import { Song } from '@base/entity/Song';
import { SongInfo } from '@base/SongInfo';
import { SuperstarGame } from '@base/entity/SuperstarGame';
import { generate_guid } from '@base/guid';
import { Artist } from '@base/entity/Artist';

const verbose = false;
const dryRun = true;

// tslint:disable: object-literal-key-quotes
const artistMap: Dictionary<string> = {
  // SM
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
  'IS': 'Irene & Seulgi',
  'Shinee': 'SHINee',
  'UKNOW': 'U-Know',
  'Yoona': 'YoonA',
  'ZHOUIMI': 'ZHOUMI',
  'Taemin': 'TAEMIN',
  'TY': 'TAEYEON',
  'Taeyeon': 'TAEYEON',
  'TaeYeon': 'TAEYEON',
  'TEAYEON' : 'TAEYEON',
  'BEAKHYUN': 'BAEKHYUN',
  'BH': 'BAEKHYUN',
  'Superm': 'SuperM',
  'Aespa': 'æspa',

  // Starship
  'Sistar': 'SISTAR',
  'Cravity': 'CRAVITY',
  'MONSTAX': 'MONSTA X',
  'MX': 'MONSTA X',
  'MonstaX': 'MONSTA X',
  'Monstax': 'MONSTA X',
  'MonsterX': 'MONSTA X',
  'JSW': 'JEONG SEWOON',
  'JEONGSEWOON': 'JEONG SEWOON',
  'BrotherSu': 'BrotherSu',
  'Madclown': 'MAD CLOWN',
  'MINDU': 'MIND U',
  'MindU': 'MIND U',
  'Mindu': 'MIND U',
  'YSW': 'YU SEUNGWOO',
  'YuseungWoo': 'YU SEUNGWOO',
  'Yuseungwoo': 'YU SEUNGWOO',
  'Wjsn': 'WJSN',
  'CCM': 'WJSN CHOCOME',
  'SoYou': 'SOYOU',
  'Kwill': 'K.WILL',
  'SOYOU&MC': 'SOYOU & MAD CLOWN',

  // Woollim
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
  'NWH': 'Nam Woo Hyun',
  'JDW': 'Jang Dong Woo',
  'KSK': 'Kim Sung Kyu',
  'KimSungKyu': 'Kim Sung Kyu',
  'WOOYOUNG': 'Jang Wooyoung',

  // JYP
  'Itzy': 'ITZY',
  'Twice': 'TWICE',
  'Jyp': 'JYP',
  'MissA': 'miss A',
  'Miss A': 'miss A',
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

  // GFRIEND
  'GF': 'GFRIEND',
  'Gf': 'GFRIEND',
  'GFriend': 'GFRIEND',
  'Gfriend': 'GFRIEND',

  // BTS
  'J*Hope': 'J-Hope',
  'bts': 'BTS',
  'Bts': 'BTS',

  // SSYG
  'Leesuhyun': 'LEE SUHYUN',
  'SECHSKEIS': 'SECHSKIES',
  'GT': 'GD X TAEYANG',
  'G1': 'EUN JIWON', // ???
  'IKON': 'iKON',
  'Winner': 'WINNER',
  'BB': 'BIGBANG',
  'BigBang': 'BIGBANG',
  'BP': 'BLACKPINK',
  'Taeyang': 'TAEYANG',
  'Daesung': 'DAESUNG',
  'Bobby': 'BOBBY',
  'KSY': 'YOON',
  'TOP': 'T.O.P',
  'GD': 'G-DRAGON',
  'JENNY': 'JENNIE',
  'Mino': 'MINO',
};

const prepareMap: Dictionary<string> = {
  // SM
  'EXO-SC': 'EXO*SC', // protect the dash
  'EXO_SC': 'EXO*SC',
  'Sehun_Chanyeol': 'EXO*SC',
  'EXO_K_': 'EXO*K_',
  'EXO_M': 'EXO*M',
  'NCT_U': 'NCT U',
  'NCT_127': 'NCT 127',
  'NCT_Dream': 'NCT Dream',
  'BAEK_HYUN': 'BAEKHYUN',
  'KYU_HYUN': 'Kyuhyun',
  'wayv_': 'WayV_',
  'Red_velvet': 'Red Velvet',
  'Red_Velvet': 'Red Velvet',
  'U_know': 'UKNOW',
  'Super_Junior': 'Super Junior',
  'Girls_Generation': 'Girls\' Generation',

  // BTS
  'j-hope': 'J*Hope',
  'J-Hope': 'J*Hope',
  'J_Hope': 'J*Hope',
  'JHope': 'J*Hope',

  // WOOLLIM
  'Kim_Sung_Kyu': 'Kim Sung Kyu',
  'JANG_WOOYOUNG': 'Jang Wooyoung',
  'Rocket_Punch': 'Rocket Punch',

  // JYP
  'Baek_Ye_Rin': 'Yerin Baek',
  'BaekYeRin': 'Yerin Baek',
  'Wonder_Girls': 'Wonder Girls',
  'Wonder_Grils': 'Wonder Girls',
  'WG': 'Wonder Girls',
  'Park_Jimin': 'Park Jimin',
  'Stray_Kids': 'Stray Kids',
  'Straykids': 'Stray Kids',
  'StrayKids': 'Stray Kids',
  'Stary_Kids': 'Stray Kids',
  'sk_': 'Stray Kids_',
  'Day_6': 'DAY6',
  'JUN_K_': 'Jun.K_',
  'Baek_A_Yeon': 'Baek A Yeon',
  'Beak_A_Yeon': 'Baek A Yeon',
  'Back_A_Yeon': 'Baek A Yeon',

  // Starship
  'DJ_SODA': 'DJ SODA',
  'Mad_Clown': 'MAD CLOWN',
  'Mind_U': 'MIND U',
  'Mind_u': 'MIND U',
  'Yu_Seung_Woo': 'YU SEUNGWOO',
  'Monsta_X': 'MONSTA X',
  'MONSTA_X': 'MONSTA X',
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
    .map((part) => {
      return part
        .replace(/_+/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .map((word) => word.trim())
        .filter((x) => x)
        .join(' ');
    });

  processed[0] = (artistMap[processed[0]] || processed[0]).trim();

  if (!processed[1]) {
    processed[1] = processed[0];
    processed[0] = 'Unknown';
  }
  processed[1] = processed[1].trim();

  return processed;
}

function parseSongName(originalFilename: string) {
  originalFilename = prepOriginalFilename(originalFilename);
  return processSongName(originalFilename);
}

createConnection()
  .then(async () => {
    if (dryRun) {
      console.log('Dry run enabled!');
    }
    const songs = getRepository(Song);
    const artistsRaw = await getRepository(Artist).find();
    const artistsByGame = _.mapValues(
      _.groupBy(artistsRaw, 'gameId'),
      (group) => _.keyBy(group, 'name'),
    );

    const songInfoPath = process.argv[2];
    if (!songInfoPath) {
      console.error(`No path provided.`);
      process.exit(1);
    }
    const songInfoFile = path.resolve(songInfoPath);
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

    const games = _.keyBy(await getRepository(SuperstarGame).find(), 'key');

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const baseId in songInfos.songinfos) {
      if (songInfos.songinfos.hasOwnProperty(baseId)) {
        const songInfo = songInfos.songinfos[baseId];

        const [gameKey, dalcomSongId] = baseId.split('/');

        const existingSong = await songs
          .createQueryBuilder('song')
          .innerJoin('song.game', 'game')
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

        if (existingSong) {
          if (verbose) {
            console.log(
              `Skipping ${gameKey}/${dalcomSongId} [${existingSong.album}] ${existingSong.name} - already inserted`,
            );
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
          artist: (artistsByGame[game.id] || {})[album],
          guid: generate_guid(),
        });

        const printArtist = newSong.artist
          ? ` / ${newSong.artist.name} (${newSong.artist.cardCount}ca)`
          : '';
        if (verbose || dryRun) {
          console.log(
            `Would insert ${game.name}/${dalcomSongId} [${newSong.album}${printArtist}] ${newSong.name} - from '${songInfo.dalcom_song_filename}'`,
          );
        }
        if (!dryRun) {
          const saved = await songs.save(newSong);
          console.log(
            `Inserted ${gameKey}/${dalcomSongId} [${newSong.album}${printArtist}] ${newSong.name} - from '${songInfo.dalcom_song_filename}' - ${saved.id}-${saved.guid}`,
          );
        }
        inserted++;
      }
    }

    console.log(
      `Done, inserted ${inserted} songs and skipped ${skipped} with ${errors.length} errors`,
      errors,
    );
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.abort();
  });
