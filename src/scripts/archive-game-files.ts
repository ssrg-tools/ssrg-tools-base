import { writeFile } from 'fs/promises';
import { HTTPError } from 'got';
import { join } from 'path';
import { BaseApiResponse } from '../api';
import { URLs } from '../definitions/data/gameinfo';
import { api, apiConfig, fetchAllGameData } from '../backend-interface';

const gameKey = process.argv[2];
if (!gameKey) {
  console.error('No gameKey provided.');
  process.exit(1);
}
const version = process.argv[3] || 'latest';

type ArchiveAssetResult = ArchiveAssetResultOk | ArchiveAssetResultError;
interface ArchiveAssetResultOk {
  result: 'success' | 'exists';
  uri: string;
  fileEntity: {
    guid: string;
    fingerprint: string;
  };
  archiveEntity: {
    guid: string;
    game: { key: string };
  };
}
interface ArchiveAssetResultError {
  result: 'error';
}

async function main() {
  const results = [];
  const timeStart = new Date();
  const { overview, contextMap } = await fetchAllGameData(gameKey, version, ['urls']);
  try {
    const urls = contextMap.urls as URLs[];
    console.log(`All game data loaded.`);
    console.log(`Archiving ${urls.length}x entries`);
    console.log();

    for (const url of urls) {
      const assetsubversion = (overview.context.urls || overview.context.URLs)
        .version;
      const apiEndpoint = `/v1/${gameKey}/gamedata/urls/${overview.version}/${assetsubversion}/archiveAsset/${url.code}`;

      const result = await api
        .post<BaseApiResponse<ArchiveAssetResult>>(apiEndpoint)
        .then((response) => ({
          timeTakenMs: response.timeTakenMs,
          assetsubversion,
          ...response.data,
        }))
        .catch((reason) => {
          if (reason instanceof HTTPError) {
            return {
              result: 'http-error',
              name: reason.name,
              message: reason.message,
              assetsubversion,
              ...JSON.parse(reason.response.body as string),
            };
          }
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
      const displayLength = 40;
      const displayCode =
        'v' + result.assetsubversion + '@' + url.code.toString().padStart(5) + '/' + urls.length;
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
    const logFilename = `log-archive-game-${timeEnd.getUTCFullYear()}-${timeEnd.getUTCMonth()}-${timeEnd.getUTCDay()}_${timeEnd.getUTCHours()}-${timeEnd.getUTCMinutes()}-${gameKey}-${overview.version}.json`;
    await writeFile(
      join(__dirname, '..', '..', '..', logFilename),
      JSON.stringify(
        {
          timeStart,
          timeEnd,
          timeTakenMs: timeEnd.getTime() - timeStart.getTime(),
          gameKey,
          results,
        },
        null,
        2,
      ),
    );
  }
}

main();
