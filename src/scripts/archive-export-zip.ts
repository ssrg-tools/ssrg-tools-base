import { writeFile } from 'fs/promises';
import got, { HTTPError } from 'got';
import { join, resolve } from 'path';
import { apiConfig, fetchResolvedFiles } from '../backend-interface';
import { replaceBytesExtension } from '../utils';
import ZipStream from 'zip-stream';
import { promisify } from 'util';
import { createWriteStream } from 'fs';

const gameKey = process.argv[2];
if (!gameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
const version = process.argv[3] || 'latest';

async function main() {
  const results = [];
  const timeStart = new Date();

  const archive = new ZipStream();
  archive.on('error', function (err: unknown) {
    throw err;
  });

  const files = await fetchResolvedFiles(gameKey, version).then(files =>
    files.map(file => ({
      ...file,
      url: file.url.includes('://') ? file.url : apiConfig.endpoint + file.url,
      originalUrl: new URL(file.originalUrl),
    })),
  );

  const resultsCounts = {
    exists: 0,
    httpError: 0,
    bigError: 0,
    success: 0,
    unknown: 0,
  };

  const archiveDate = new Date().toISOString().replace(/[:T]/g, '-');
  const archiveName = resolve(join(__dirname, '..', '..', '..', `archive-${gameKey}-${archiveDate}.zip`));
  console.log('Archiving to', archiveName);
  try {
    const awsList = ['.cloudfront.'];
    const ignoredUrlList = new Set<URL>();
    const alreadyAdded = new Set<string>();

    const archiveOut = createWriteStream(archiveName);

    return await new Promise<void>(async (done, reject) => {
      archiveOut.on('close', function () {
        done();
      });
      archiveOut.on('error', err => reject(err));

      archive.pipe(archiveOut);

      const addEntry = promisify(archive.entry.bind(archive));
      let ii = 1;
      for (const file of files) {
        if (!awsList.some(aws => file.originalUrl.hostname.includes(aws))) {
          ignoredUrlList.add(file.originalUrl);
          continue;
        }

        const zipPath = replaceBytesExtension(file.originalUrl.pathname, file.mime);

        if (alreadyAdded.has(file.originalUrl.href)) {
          console.log(`${gameKey} ${ii++}/${files.length} (already added): ${zipPath}`);
          continue;
        }

        const fileTimeStart = new Date();

        const request = await got(file.url);
        const rawDl = request.rawBody;

        const result = await addEntry(rawDl, {
          name: zipPath,
          date: file.sourceDateModified,
        });

        const fileTimeEnd = new Date();
        const timeTakenMs = fileTimeEnd.getTime() - fileTimeStart.getTime();

        const resultEntry = {
          result,
          file,
          fileTimeStart,
          fileTimeEnd,
          timeTakenMs,
        };
        results.push(resultEntry);
        resultsCounts['success']++;
        alreadyAdded.add(file.originalUrl.href);
        console.log(`${gameKey} ${ii++}/${files.length} (${(timeTakenMs / 1000).toFixed(2)}s): ${zipPath}`);
      }

      archive.finalize();
      // archiveOut.close();
      done();
    });
  } catch (error) {
    console.error(error);
    if (error instanceof HTTPError) {
      console.error(error.request.requestUrl);
    }
  } finally {
    const timeEnd = new Date();
    const logFilename = `log-archive-files-${archiveDate}-${gameKey}-${version}.json`;
    await writeFile(
      join(__dirname, '..', '..', '..', logFilename),
      JSON.stringify(
        {
          timeStart,
          timeEnd,
          timeTakenMs: timeEnd.getTime() - timeStart.getTime(),
          resultsCounts,
          gameKey,
          results,
        },
        null,
        2,
      ),
    );
    console.log(resultsCounts);
    console.log(`Log written to ${logFilename}`);
  }
}

main();
