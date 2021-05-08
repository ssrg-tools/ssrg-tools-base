import got from 'got';
import * as crypto from 'crypto';
import { SuperstarGame } from '@base/entity/SuperstarGame';
import { createConnection, getRepository } from 'typeorm';

const gameKey = 'bts';
const endpoint = 'http://localhost:8080';

// const iv = '1234123412341234';

export interface ServerResponse<T> {
  code: number;
  result?: T;
  invoke?: any;
}

export function doRequest<R = any, T = any>(
  url: string,
  encryptionKey: string,
  body: T,
): Promise<ServerResponse<R>> {
  const bodyStr = JSON.stringify(body);

  const iv = crypto.randomBytes(8).toString('hex');
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    iv,
  );
  const encrypted = cipher.update(bodyStr);
  const finalBuffer = Buffer.concat([encrypted, cipher.final()]);

  return got
    .post(url, {
      headers: {
        'X-SuperStar-AES-IV': iv.toString(),
        'Content-Type': 'application/json',
      },
      body: finalBuffer.toString('base64'),
      throwHttpErrors: false,
    })
    .json();
}

createConnection()
  .then(async () => {
    const game = await getRepository(SuperstarGame).findOneOrFail({
      where: { key: gameKey },
      select: ['name', 'apkName', 'encryptionKey'],
    });
    if (!game.encryptionKey) {
      console.error(`Game '${game.name}' doesn't have an encryption key!`);
      process.exit(1);
    }

    const bodyRaw = {
      class: 'Account',
      method: 'createAccount',
      params: Object.values({
        provider: 0,
        userID: 'asdf',
        localPassword: 'asdf',
        language: 1,
        device: 1,
      }),
    };

    const response = await doRequest(endpoint, game.encryptionKey, bodyRaw);
    console.log(response);
  })
  .then(() => process.exit(0))
  .catch((reason) => {
    console.error(reason);
    process.exit(1);
  });
