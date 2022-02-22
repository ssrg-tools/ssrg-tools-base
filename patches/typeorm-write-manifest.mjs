import { writeFile } from 'fs/promises';

const contents = `{
  "type": "module"
}
`;

await writeFile(new URL('../node_modules/typeorm/browser/package.json', import.meta.url), contents);
