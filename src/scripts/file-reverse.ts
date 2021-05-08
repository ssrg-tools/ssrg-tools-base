import { readFileSync, writeFileSync } from 'fs';
import { basename, dirname, extname, join } from 'path';
import { isReversedFile, reverseBuffer } from '@base/dalcom-files';

const path = process.argv[2];
if (!path) {
  console.error('No path provided.');
  process.exit(1);
}

const contents = readFileSync(path);
const isReversed = isReversedFile(contents);
console.log(isReversed);
if (!isReversed) {
  console.error('Error: File is not reversed!');
  process.exit();
}
const reversed = reverseBuffer(contents);

const origDir = dirname(path);
const origExt = extname(path);
const origName = basename(path, origExt);

const newPath = join(origDir, `${origName}.r${origExt}`);
writeFileSync(newPath, reversed);

console.log('Wrote ' + newPath);
