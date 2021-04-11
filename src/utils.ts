import moment, { Moment } from 'moment-timezone';

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
