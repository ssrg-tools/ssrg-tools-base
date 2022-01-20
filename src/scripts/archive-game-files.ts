import { writeFile } from 'fs/promises';
import { HTTPError } from 'got';
import { join } from 'path';
import { ArchiveAssetResult, ArchiveAssetResultError, ArchiveAssetResultOk, BaseApiResponse } from '../api';
import { api, apiConfig, fetchAllGameData } from '../backend-interface';
import { URLs } from '../definitions/data/gameinfo';

const gameKey = process.argv[2];
if (!gameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
const version = process.argv[3] || 'latest';

async function main() {
  const results = [];
  const timeStart = new Date();
  const { overview, contextMap } = await fetchAllGameData(gameKey, version, [
    'urls',
  ]);
  const resultsCounts = {
    exists: 0,
    httpError: 0,
    bigError: 0,
    success: 0,
    unknown: 0,
  };
  try {
    const urls = contextMap.urls as URLs[];
    console.log(`All game data loaded.`);
    console.log(`Archiving ${urls.length}x entries`);
    console.log();

    for (const url of urls) {
      const assetsubversion = (overview.context.urls || overview.context.URLs)
        .version;
      const apiEndpoint = `/v1/${gameKey}/gamedata/urls/${overview.version}/${assetsubversion}/archiveAsset/${url.code}`;

      type ArchiveAssetHandlerResult = (
        | (ArchiveAssetResultOk & {
            timeTakenMs: number;
          })
        | ArchiveAssetResultError
      ) & {
        assetsubversion: number;
      };

      const result: ArchiveAssetHandlerResult = await api
        .post<BaseApiResponse<ArchiveAssetResult>>(apiEndpoint)
        .then((response) => {
          if (response.data.result === 'success') {
            resultsCounts.success++;
          } else if (response.data.result === 'exists') {
            resultsCounts.exists++;
          } else {
            resultsCounts.unknown++;
          }
          return {
            timeTakenMs: response.timeTakenMs,
            assetsubversion,
            ...response.data,
          };
        })
        .catch((reason) => {
          if (reason instanceof HTTPError) {
            resultsCounts.httpError++;
            return {
              result: 'http-error',
              name: reason.name,
              message: reason.message,
              assetsubversion,
              ...JSON.parse(reason.response.body as string),
            };
          }
          resultsCounts.bigError++;
          return {
            result: 'big-error',
            name: reason.name,
            message: reason.message,
            assetsubversion,
          };
        });
      results.push({
        apiEndpoint,
        url,
        result,
      });
      // tslint:disable-next-line: no-string-literal
      const resultUrl = result['uri'] ? apiConfig.endpoint + result['uri'] : '';
      const displayLength = 50;
      const displayCode =
        'v' +
        result.assetsubversion +
        '@' +
        url.code.toString().padStart(5) +
        '/' +
        urls.length;
      console.log(
        `${displayCode} ...${url.url
          .replace(/\?.+$/, '')
          .slice(-displayLength)
          .padStart(displayLength)}: ${result.result.padEnd(7)} ${resultUrl}`,
      );
    }
  } catch (error) {
    console.error(error);
    if (error instanceof HTTPError) {
      console.error(error.request.requestUrl);
    }
  } finally {
    const timeEnd = new Date();
    const logFilename = `log-archive-game-${(new Date()).toISOString().replace(/[:T]/g, '-')}-${gameKey}-${
      overview.version
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
