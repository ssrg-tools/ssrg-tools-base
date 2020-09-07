import * as fs from 'fs';
import * as path from 'path';

import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import _ from 'lodash';

import { Song } from '../entity/Song';
import { SongInfo } from '../SongInfo';
import { SuperstarGame } from '../entity/SuperstarGame';
import { generate_guid } from '../guid';

const verbose = false;
const dryRun = true;
const dateReleased = new Date('2020-01-01T09:00:00');

// tslint:disable: object-literal-key-quotes
const artistMap = {
  'EXO*SC': 'EXO-SC',
  'Exo': 'EXO',
  'RV': 'Red Velvet',
  'rv': 'Red Velvet',
  'Rv': 'Red Velvet',
  'Redvelvet': 'Red Velvet',
  'Boa': 'BoA',
  'GG': 'Girls\' Generation',
  'CBX': 'EXO-CBX',
  'D&E': 'Super Junior-D&E',
  'SJ': 'Super Junior',
  'SuperJunior': 'Super Junior',
  'SEOHYUN': 'Seohyun',
  'Station0': 'SM Station',
  'Station': 'SM Station',
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
  'Jyp': 'JYP',
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
  'MissA': 'miss A',
  'Miss A': 'miss A',
  'Shinee': 'SHINee',
  'UKNOW': 'U-Know',
  'Yoona': 'YoonA',
  'ZHOUIMI': 'ZHOUMI',
};

const prepareMap = {
  'EXO-SC': 'EXO*SC', // protect the dash
  'NCT_U': 'NCT U',
  'NCT_127': 'NCT 127',
  'Hope.ogg': 'School OZ - 빛 (Hope) (Hidden Stage)',
  'page_0.ogg': 'SM Station_page_0.ogg',
  'Written_In_The_Stars.ogg': 'SM Station_Written_In_The_Stars.ogg',
  'badboy.ogg': 'RV_Bad Boy',
  'rbb.ogg': 'Red Velvet_RBB (Really Bad Boy)',
  'rbb_eng.ogg': 'Red Velvet_RBB (English Ver.)',
  'look.ogg': 'Red Velvet_Look',
  'Russian_Roulette_Q2.ogg': 'Red Velvet_Russian_Roulette',
  'peek-a-boo.ogg': 'RV_피카부 (Peek-A-Boo)',
  'little_little.ogg': 'RV_Little Little',
  'hit_that_drum.ogg': 'RV_Hit That Drum',
  'you_better_know.ogg': 'RV_You Better Know',
  'time_to_love.ogg': 'RV_Time to Love',
  'power_up.ogg': 'RV_Power Up',
  'Magic.ogg': 'Seohyun_Magic',
  'Red_velvet': 'Red Velvet',
  'Red_Velvet': 'Red Velvet',
  'Beautiful_Life.ogg': 'Shinee_Beautiful Life',
  'our_page.ogg': 'Shinee_Our Page',
  'Cover_up.ogg': 'Taeyeon_Cover Up',
  'U_know': 'UKNOW',
  'hello.ogg': 'Ryeowook_그대 (Hello)',
  'The_Little_Prince.ogg': 'Ryeowook_The_Little_Prince.ogg',
  'to_you.ogg': 'YoonA_너에게 (To You)',
  'when_the_wind_blows.ogg': 'YoonA_when_the_wind_blows.ogg',
  'paper_umbrella.ogg': 'YESUNG_paper_umbrella.ogg',
  'unuo_follow.ogg': 'UKNOW_follow.ogg',
  'The_7th_Sense_Q2.ogg': 'NCT_The_7th_Sense_Q2.ogg',
  'OOH_AAH.ogg': 'TWICE_Like OOH-AHH (OOH-AHH하게)',
  '1to10.ogg': 'TWICE_1 to 10',
  'CHEER_UP.ogg': 'TWICE_Cheer Up',
  'PIT_A_PAT.ogg': 'TWICE_Pit-A-Pat',
  'I_think_im_crazy.ogg': 'TWICE_미쳤나봐 (I Think I\'m Crazy)',
  'Truth.ogg': 'TWICE_Truth.ogg',
  'Love_is_U.ogg': 'miss A_Love Is U',
  'Good_Bye_Baby.ogg': 'miss A_Good_Bye_Baby.ogg',
  'Like_A_Fool.ogg': 'miss A_Like_A_Fool.ogg',
  'Only_you.ogg': 'miss A_Only_you.ogg',
  'LoveSong.ogg': 'miss A_LoveSong.ogg',
  'Breathe.ogg': 'miss A_Breathe.ogg',
  'Badgirl_Goodgirl.ogg': 'miss A_Bad girl, Good girl.ogg',
  'One_Step.ogg': 'miss A_One Step (한걸음)',
  'I_dont_need_a_man.ogg': 'miss A_I don\'t need a man(남자 없이 잘 살아)',
  'TUSM_TUSM.ogg': 'Yubin_Thank U Soooo Much',
  'lady.ogg': 'Yubin_숙녀 (Lady)',
  'Full_Moon.ogg': 'Sunmi_Full Moon',
  '24_Hours.ogg': 'Sunmi_24_Hours.ogg',
  'Frozen_in_Time.ogg': 'Sunmi_멈춰버린 시간 (Frozen In Time)',
  'Burn.ogg': 'Sunmi_Burn.ogg',
  'Who_am_I.ogg': 'Sunmi_Who Am I (내가 누구)',
  'JANG_WOOYOUNG': 'Jang Wooyoung',
  'WOOYOUNG': 'Jang Wooyoung',
  'Baek_Ye_Rin': 'Yerin Baek',
  'BaekYeRin': 'Yerin Baek',
  'Wonder_Girls': 'Wonder Girls',
  'Wonder_Grils': 'Wonder Girls',
  'Rewind.ogg': 'WG_Rewind.ogg',
  'Nobody.ogg': 'WG_Nobody.ogg',
  'Why_So_Lonely_Q2.ogg': 'WG_Why_So_Lonely_Q2.ogg',
  'fever.ogg': 'JYP_fever.ogg',
  'WG': 'Wonder Girls',
  'Stray_Kids': 'Stray Kids',
  'Straykids': 'Stray Kids',
  'StrayKids': 'Stray Kids',
  'sk_': 'Stray Kids_',
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
        .filter(x => x)
        .join(' ')
    );

  processed[0] = (artistMap[processed[0]] || processed[0]).trim();

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
        guid: generate_guid(),
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
