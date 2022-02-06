import { Buffer } from 'buffer';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'es6-promisify';
import type { InputType } from 'zlib';
import type { InfoAggregate } from './definitions/data/InfoAggregate';

const algorithm = 'aes-256-ecb';
const jsonPrettyIndent = 2;

export async function downloadInfoFile(clearkey: string, url: string) {
  const { default: got } = await import('got');
  const crypto = await import('crypto');
  const { default: zlib } = await import('zlib');
  const gunzip = promisify<InputType, Buffer>(zlib.gunzip);

  const request = await got(url);
  const rawDl = request.rawBody;
  const unzipped = await gunzip(rawDl);

  const decipher = crypto.createDecipheriv(algorithm, clearkey, '');
  const decrypted = Buffer.concat([decipher.update(unzipped.toString(), 'base64'), decipher.final()]);
  return decrypted;
}

export async function processAggregate(clearkey: string, infoAggregate: InfoAggregate, basedir: string) {
  const aggregateVersion = infoAggregate.version;
  const dir = join(basedir, 'v' + aggregateVersion);
  mkdirSync(dir);
  writeFileSync(join(dir, 'Info.json'), JSON.stringify(infoAggregate, null, jsonPrettyIndent));
  for (const key in infoAggregate.context) {
    if (Object.prototype.hasOwnProperty.call(infoAggregate.context, key)) {
      const { file: url, version: contextVersion } = infoAggregate.context[key];
      let contents: Buffer;
      try {
        contents = await downloadInfoFile(clearkey, url);
      } catch (error) {
        const { RequestError } = await import('got');
        if (typeof error === 'object' && error instanceof RequestError) {
          console.log(`v${aggregateVersion}: Could not download ${key} - skipping`);
          continue;
        }

        console.error(`v${aggregateVersion}: Error for ${key}!`);
        console.error(error);
        continue;
      }
      const prettified = JSON.stringify(JSON.parse(contents.toString()), null, jsonPrettyIndent);
      writeFileSync(join(dir, key + '.json'), prettified);
      console.log(`v${aggregateVersion}: ${key} (v${contextVersion}) done.`);
    }
  }
}

export function isCdnAddress(url: string): boolean {
  const obj = new URL(url);
  return obj.hostname === 'res.qmtt.punchbox.info';
}
