import { readFileSync } from 'fs';
import { isReversedFile } from '@base/dalcom-files';

const path = process.argv[2];
if (!path) {
  console.error('No path provided.');
  process.exit(1);
}

console.log(isReversedFile(readFileSync(path)));
