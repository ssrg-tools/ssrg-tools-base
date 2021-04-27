import _ from 'lodash';
import moment, { Moment } from 'moment-timezone';
import crypto from 'crypto';

export const KST = 'Asia/Seoul';

export function boxSplit(input: string | string[], split = ' ') {
  if (typeof input === 'string') {
    return input.split(split);
  }
  return input;
}

export function scoreBonusCalculate(dateAlbum: Date | Moment, dateArtists: (Date | Moment)[] = [], dateNow: Date | Moment = new Date()) {
  let bonus = 0;

  if (scoreBonusInDateRange(dateAlbum, dateNow)) {
    bonus += 3;
  }

  dateArtists.forEach(date => {
    if (scoreBonusInDateRange(date, dateNow)) {
      bonus += 2;
    }
  });

  return bonus;
}

export function scoreBonusInDateRange(datePoint: Date | Moment, dateNow: Date | Moment = moment()) {
  const scoreBonusDayDiff = 3;
  const mDatePoint = moment(datePoint).tz(KST);
  const mDatePointStart = mDatePoint.clone().add(-scoreBonusDayDiff, 'day').startOf('day');
  const mDatePointEnd = mDatePoint.clone().add(scoreBonusDayDiff, 'day').endOf('day');

  const mDateNow = moment(dateNow).tz(KST);

  // if (current >= start && current <= end) {
  if (mDateNow >= mDatePointStart && mDateNow <= mDatePointEnd) {
    return true;
  }

  return false;
}

export function scoreBonusCountdown(datePoint: Date | Moment, dateNow: Date | Moment = moment()) {
  const scoreBonusDayDiff = 3;
  const mDateNow = moment(dateNow).tz(KST).startOf('day');
  const mDatePoint = moment(datePoint).tz(KST).year(mDateNow.year());
  const mDatePointStart = mDatePoint.clone().startOf('day');
  const mDatePointEnd = mDatePoint.clone().add(scoreBonusDayDiff, 'day').endOf('day');
  if (mDateNow > mDatePointEnd) {
    mDatePointStart.year(mDateNow.year() + 1);
  }
  mDatePointStart.add(-scoreBonusDayDiff, 'day').startOf('day');

  return mDatePointStart.diff(mDateNow, 'days');
}

export function createFingerprint(algo: string, input: string | Buffer) {
  return crypto.createHash(algo).update(input).digest('hex');
}

function buildPrefixKeysFromQuery(query: object, prefix) {
  const map: [string, (string | number)][] = [];
  for (const extractKey in query) {
    if (Object.prototype.hasOwnProperty.call(query, extractKey) && extractKey.length > prefix.length && extractKey.startsWith(prefix)) {
      const value = JSON.parse(query[extractKey] as string);
      const fieldNameRaw = extractKey.slice(prefix.length);
      const fieldName = fieldNameRaw.slice(0, 1).toLowerCase() + fieldNameRaw.slice(1);
      map.push([fieldName, value]);
    }
  }
  return map;
}

/** ?selectCode=123 => .filter(x => x.code === 123) */
export function selectDataByQuery<T>(data: T[], query: object, selectPrefix = 'select') {
  const selectMap = buildPrefixKeysFromQuery(query, selectPrefix);

  if (selectMap.length) {
    const select: (e: any) => boolean = (e) => selectMap.some(param => e[param[0]] === param[1]);

    data = data.filter(select);
  }

  return data;
}

/** ?selectCode=123 => .filter(x => x.code === 123) */
export function extractDataByQuery<T>(data: T | T[], extractBy: string | string[]) {
  if (typeof data !== 'object') {
    return data;
  }
  if (extractBy instanceof Array && extractBy.length === 1) {
    extractBy = extractBy[0];
  }
  const finalExtractBy = extractBy;
  let extract: (e: T) => any;

  if (typeof finalExtractBy === 'string') {
    extract = e => e[finalExtractBy];
  } else {
    extract = e => _.pick(e, finalExtractBy);
  }

  if (data instanceof Array) {
    return data.map(extract);
  }
  return extract(data);
}

export function s3SafeFilename(name: string) {
  // allow forward slashes (but remove repetitions)
  return name.trim()
    .replace(/[|\\:<>?"^&~%\s]+/g, '-')
    .replace(/[ .]+$/, '')
    .replace(/^[ .]+/, '')
    .replace(/\/+/g, '/')
  ;
}

export function createKeyFromUrl(url: string) {
  const obj = new URL(url);

  let { hostname, pathname } = obj;
  let hostmatch: RegExpMatchArray;
  // tslint:disable: no-conditional-assignment
  if (hostmatch = hostname.match(/^([\w\-]+)\.cloudfront\.net$/)) {
    hostname = 'cf-' + hostmatch[1];
  } else if (hostmatch = hostname.match(/^([\w\-]+)\.s3-ap-[\w\-]+\.amazonaws\.com$/)) {
    hostname = 's3-' + hostmatch[1];
  } else if (/^s3.ap-[\w\-]+\.amazonaws\.com$/.test(hostname)) {
    const bucketName = pathname.match(/^\/([\w\-]+)\//)[1];
    hostname = 's3-' + bucketName;
    pathname = pathname.slice(bucketName.length + 2);
  }

  pathname = pathname
    .replace(/^\/version?\//, '')
    .replace(/^\/(real\/|live\/|production\/)?/, '')
    .replace(/^\/resources?\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
  ;

  const ret = hostname + '-' + pathname;
  return ret;
}
