import { readFile } from 'fs';
import { parseBeatmapFile } from '../seq';

const path = process.argv[2];
if (!path) {
  console.error('No path provided.');
  process.exit(1);
}

readFile(path, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const result = parseBeatmapFile(data);

  result.notes = result.notes.slice(0, 50);
  console.log(result);
});
