import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { difficultyNames } from '../types';
import { Beatmap, parseBeatmapFile } from '../seq';

const path = process.argv[2];
if (!path) {
  console.error('No path provided.');
  process.exit(1);
}

const errors: { path: string; error: Error }[] = [];
const issues: { path: string; beatmap: Beatmap }[] = [];
let beatmapCount = 0;

async function traverseDir(dirname: string) {
  const listing = await readdir(dirname);
  for (const entry of listing) {
    const entryPath = join(dirname, entry);
    const fstat = await stat(entryPath);
    if (fstat.isDirectory()) {
      await traverseDir(entryPath);
    } else if (entry.endsWith('.seq')) {
      beatmapCount++;
      try {
        const beatmap = await parseBeatmapFile(entryPath);
        const version = beatmap.info.layoutVersion - 0x64;
        console.log(
          `${entryPath.padEnd(55)}: v${version}, ${difficultyNames[beatmap.info.difficultyId].padEnd(
            6,
          )}, ${beatmap.issues?.length?.toString()?.padStart(2)}x issues, ${beatmap.notes.length
            .toString()
            .padStart(4)}x /${beatmap.info.noteCount.toString().padStart(4)}x notes, ${
            beatmap.info.tempoCount
          }x tempo(s), "${beatmap.filename}"`,
        );
        if (beatmap?.issues?.length) {
          issues.push({ path: entryPath, beatmap });
        }
      } catch (error) {
        errors.push({
          path: entryPath,
          error,
        });
      }
    }
  }
}

const timeStart = Date.now();

traverseDir(path).then(() => {
  issues.forEach(entry => {
    console.log(`[WARNING] ${entry.path}:`);
    entry.beatmap.issues.forEach(issue => console.log(`  - ${issue.message}`));
    console.log('');
  });
  errors.map(entry => `[ERROR] ${entry.path.padEnd(55)}: ${entry.error.message}`).forEach(line => console.log(line));

  console.log(`Processed ${beatmapCount}x beatmaps.`);
  if (errors.length) {
    console.log(`There were ${errors.length}x errors.`);
  }
  if (issues.length) {
    console.log(`There were ${issues.length}x issues.`);
  }

  const timeEnd = Date.now();
  const timeTaken = Math.round((timeEnd - timeStart) / 100 / 60) / 10;
  console.log(`Took ${timeTaken}m.`);
});
