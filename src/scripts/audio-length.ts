import { getAudioDurationInSeconds } from 'get-audio-duration';
import { resolve } from 'path';

const path = process.argv[2];
if (!path) {
  console.error('No path provided.');
  process.exit(1);
}

getAudioDurationInSeconds(path).then(duration => {
  console.log(resolve(path), duration);
});
