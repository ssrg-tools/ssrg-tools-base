import { Dictionary } from 'lodash';
import { AllGameInfo } from '@base/definitions/data/gameinfo';
import { BaseApiResponse } from '@base/api';
import { api } from '@base/backend-interface';

async function main(gameKey: string, contextKey: string, verifyKey: string) {
  const contextDataEndpoint = `/v1/${gameKey}/gamedata/${contextKey}`;
  const contextDataVersions = (
    await api.get<BaseApiResponse<number[]>>(contextDataEndpoint)
  ).data;
  console.log(contextDataVersions);

  const map: Dictionary<Dictionary<number>> = {};

  const promises$ = contextDataVersions.map(async (version) => {
    const contextData = await api.get<AllGameInfo[]>(
      contextDataEndpoint + '/' + version + '?noWrap=true',
    );
    contextData.forEach((entry) => {
      const byCode = map[entry.code] || {};
      const byVerifyKey = byCode[entry[verifyKey]];
      byCode[entry[verifyKey]] = (byVerifyKey || 0) + 1;
      map[entry.code] = byCode;
    });
  });

  await Promise.all(promises$);

  // console.log(map);
  console.log(
    Object.values(map).every((byCode) => Object.keys(byCode).length === 1),
  );
  console.log('Done.');
}

main('gfriend', 'urls', 'url');
