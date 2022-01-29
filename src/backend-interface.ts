import got, { OptionsOfTextResponseBody } from 'got';
import _ from 'lodash';
import { Dictionary } from 'lodash';
import { BaseApiResponse, ResolvedUrls } from './api';
import { AllGameInfo } from './definitions/data/gameinfo';

import apiConfig_ from '../config.api.json';
export const apiConfig = apiConfig_;

// Interface with backend via HTTP API, instead of accessing the database directly

export interface ApiConfig {
  authKey: string;
  endpoint: string;
}

export interface EnrichedInfoOverview {
  version: number;
  context: { [contextKey: string]: EnrichedInfoContext };
}

export interface EnrichedInfoContext {
  version: number;
  file: string;
  link: string;
  linkLatest: string;
}

function buildStandardHeaders(options?: OptionsOfTextResponseBody): OptionsOfTextResponseBody {
  return {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${apiConfig.authKey}`,
    },
  };
}

export const api = {
  get<T = any>(endpoint: string, options?: OptionsOfTextResponseBody): Promise<T> {
    return got(apiConfig.endpoint + endpoint, buildStandardHeaders(options)).json();
  },
  getRaw(endpoint: string, options?: OptionsOfTextResponseBody): Promise<Buffer> {
    return got(apiConfig.endpoint + endpoint, buildStandardHeaders(options)).buffer();
  },
  post<T = any>(endpoint: string, options?: OptionsOfTextResponseBody): Promise<T> {
    return got.post(apiConfig.endpoint + endpoint, buildStandardHeaders(options)).json();
  },
};

export async function fetchAllGameData(gameKey: string, version = 'latest', only: string[] = []) {
  const contextMap: Dictionary<AllGameInfo[]> = {};
  const contextMapByCode: Dictionary<Dictionary<AllGameInfo>> = {};
  const overview = (
    await got(apiConfig.endpoint + '/v1/' + gameKey + `/gamedata/Info/` + version).json<
      BaseApiResponse<EnrichedInfoOverview>
    >()
  ).data;
  const loadContexts$: Promise<any>[] = Object.entries(overview.context).map(async ([contextKey, contextInfo]) => {
    const contextKeyLowercase = contextKey.toLowerCase();
    if (
      contextKeyLowercase === 'cdnaddress' ||
      (only.length && !only.find(check => check === contextKey || check === contextKeyLowercase))
    ) {
      return;
    }
    const data = (await got(contextInfo.link).json<BaseApiResponse<AllGameInfo[]>>()).data;

    contextMap[contextKey] = data;
    contextMap[contextKey.toLowerCase()] = data;

    if (data[0]?.code) {
      const byCode = _.keyBy(data, 'code');
      contextMapByCode[contextKey] = byCode;
      contextMapByCode[contextKey.toLowerCase()] = byCode;
    }
  });

  await Promise.all(loadContexts$);

  return {
    overview,
    contextMap,
    contextMapByCode,
  };
}

export async function fetchResolvedFiles(gameKey: string, version = 'latest') {
  const response = await got(
    apiConfig.endpoint + '/v1/' + gameKey + `/gamedata/urls/` + version + '/resolvedFiles?selectIsExist=true',
  ).json<BaseApiResponse<ResolvedUrls>>();

  return response.data;
}
