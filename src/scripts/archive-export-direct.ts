import { writeFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import got, { HTTPError } from 'got';
import { dirname, join, resolve } from 'path';
import { replaceBytesExtension } from '../utils';
import { utimes } from 'utimes';
import { apiConfig, fetchResolvedFiles } from '../backend-interface';

const gameKey = process.argv[2];
if (!gameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
const version = process.argv[3] || 'latest';

async function main() {
  const results = [];
  const timeStart = new Date();

  const files = await fetchResolvedFiles(gameKey, version)
    .then(
      files => files.map(file => ({
        ...file,
        url: file.url.includes('://') ? file.url : apiConfig.endpoint + file.url,
        originalUrl: new URL(file.originalUrl),
      }))
    );

  const resultsCounts = {
    alreadyAdded: 0,
    ignored: 0,
    success: 0,
  };

  const archiveDate = (new Date()).toISOString().replace(/[:T]/g, '-');
  const archiveBasedir = resolve(join(__dirname, '..', '..', '..', 'assets', 'archives', `archive-${gameKey}-${archiveDate}`));
  await mkdir(archiveBasedir, { recursive: true });
  console.log('Archiving to', archiveBasedir);

  const ignoredUrlList = new Set<URL>();
  const alreadySaved = new Set<string>();

  try {
    const awsList = ['.cloudfront.'];

    let ii = 1;
    for (const file of files) {
      if (!awsList.some((aws) => file.originalUrl.hostname.includes(aws))) {
        ignoredUrlList.add(file.originalUrl);
        console.log(`${gameKey} ${ii++}/${files.length} (skipping): ${file.originalUrl}`);
        resultsCounts.ignored++;
        continue;
      }

      const zipPath = replaceBytesExtension(file.originalUrl.pathname, file.mime);

      if (alreadySaved.has(file.originalUrl.href)) {
        console.log(`${gameKey} ${ii++}/${files.length} (already added): ${zipPath}`);
        resultsCounts.alreadyAdded++;
        continue;
      }

      const fileTimeStart = new Date();

      const request = await got(file.url);
      const rawDl = request.rawBody;

      const filePath = resolve(join(archiveBasedir, zipPath));

      await mkdir(dirname(filePath), { recursive: true });

      writeFileSync(
        filePath,
        rawDl,
      );

      await utimes(filePath, new Date(file.sourceDateModified).getTime());

      const fileTimeEnd = new Date();
      const timeTakenMs = fileTimeEnd.getTime() - fileTimeStart.getTime();

      const resultEntry = {
        file,
        fileTimeStart,
        fileTimeEnd,
        timeTakenMs,
      };
      results.push(resultEntry);
      resultsCounts['success']++;
      alreadySaved.add(file.originalUrl.href);
      console.log(`${gameKey} ${ii++}/${files.length} (${(timeTakenMs / 1000).toFixed(2)}s): ${zipPath}`);
    }
  } catch (error) {
    console.error(error);
    if (error instanceof HTTPError) {
      console.error(error.request.requestUrl);
    }
  } finally {
    const timeEnd = new Date();
    const logFilename = `log-archive-files-${archiveDate}-${gameKey}-${version
      }.json`;
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
          ignoredUrlList,
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
