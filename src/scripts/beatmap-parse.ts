import { parseBeatmapFile } from '../seq';

const path = process.argv[2];
if (!path) {
  console.error('No path provided.');
  process.exit(1);
}

parseBeatmapFile(path).then(beatmap => {
  console.log(`Number of (valid) notes: ${beatmap.notes.length}`);
  beatmap.notes = beatmap.notes.slice(0, 50);
  console.log(beatmap);
}).catch(reason => console.error('Error during processing.', reason));
