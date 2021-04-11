import moment from 'moment-timezone';

export function boxSplit(input: string | string[], split = ' ') {
  if (typeof input === 'string') {
    return input.split(split);
  }
  return input;
}

export function scoreBonusInDateRange(datePoint: Date, dateNow: Date = new Date()) {
  const scoreBonusDayDiff = 3;
  const mDatePoint = moment(datePoint).tz('Asia/Seoul');
  const mDatePointStart = mDatePoint.clone().add(-scoreBonusDayDiff, 'day').startOf('day');
  const mDatePointEnd = mDatePoint.clone().add(scoreBonusDayDiff, 'day').endOf('day');

  const mDateNow = moment(dateNow).tz('Asia/Seoul');

  // if (current >= start && current <= end) {
  if (mDateNow >= mDatePointStart && mDateNow <= mDatePointEnd) {
    return true;
  }

  return false;
}

export function scoreBonusCountdown(datePoint: Date, dateNow: Date = new Date()) {
  const scoreBonusDayDiff = 3;
  const mDateNow = moment(dateNow).tz('Asia/Seoul').startOf('day');
  const mDatePoint = moment(datePoint).tz('Asia/Seoul').year(mDateNow.year());
  const mDatePointStart = mDatePoint;
  const mDatePointEnd = mDatePoint.clone().add(scoreBonusDayDiff, 'day').endOf('day');
  if (mDateNow > mDatePointEnd) {
    mDatePointStart.year(mDateNow.year() + 1);
  }
  mDatePointStart.add(-scoreBonusDayDiff, 'day').startOf('day');

  return mDatePointStart.diff(mDateNow, 'days');
}
