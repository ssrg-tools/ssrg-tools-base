import fs from 'fs';
import path from 'path';
import { Song } from '../entity/Song';
import { NumberLike } from '../types';

export function writeRankingDataToCache(
  gameKey: string,
  key: NumberLike,
  timestamp: string,
  song: Song,
  contents: string,
) {
  const dir = path.join(
    __dirname,
    '..', '..', '..',
    'assets',
    'wr-cache',
    gameKey,
    `${key}_${timestamp}`
  );
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFile(path.join(dir, song.internalSongId + '.json'), contents, 'utf8', (err) => {
    if (err) {
        console.log('An error occured while writing JSON Object to File.');
        return console.log(err);
    }
  });
}
