import { Card } from './types';
import _, { Dictionary } from 'lodash';
import { SongBeatmap } from './entity/SongBeatmap';
import { SongClear } from './entity/SongClear';
import { SongClearCard } from './entity/SongClearCard';

export function calculateIdealScore(cards: Card[], themeBonus: number, cardbookBonus = 0) {
  return Math.round((_.meanBy(cards, 'score') + 3) * 29000) + themeBonus + cardbookBonus;
}

export function calculateThemeBonus(cards: Card[]) {
  if (!cards.length) {
    return 0;
  }

  const firstTheme = cards[0].theme;
  if (cards.every(card => card.grade === 'R' && _.isEqual(firstTheme, card.theme))) {
    return 500000 + Math.min(0, (cards.length - 3) * 15000);
  }
}

export function calcRawBaseScore(cards: Card[]) {
  return Math.round((_.meanBy(cards, 'score') + 3) * 20000);
}

export function songClearCardsToCards(songClearCards: SongClearCard[]) {
  return songClearCards.map(card => new Card(card.grade, card.level, !!card.isPrism));
}

export function calcTrueNotScore(songClear: SongClear, beatmaps: Dictionary<SongBeatmap>) {
  // check if unequipped first
  if (
    songClear.scoreBase > 60000 ||
    songClear.scoreTotal > 85000 ||
    songClear.themeLevel || // unequipped should be 0/null
    songClear.hitMiss ||
    typeof songClear.hitGood !== 'number' ||
    typeof songClear.hitPerfect !== 'number' ||
    typeof songClear.hitSuperPerfect !== 'number'
  ) {
    // check for balanced R set
    if (!songClear.cards?.length) {
      return;
    }
    const firstCard = songClear.cards[0];
    if (
      !songClear.cards.every(card => card.grade === 'R') ||
      !songClear.cards.every(card => card.level === firstCard.level) ||
      !songClear.cards.every(card => card.isPrism === firstCard.isPrism)
    ) {
      return;
    }
    const balancedBase = calcRawBaseScore(songClearCardsToCards(songClear.cards));
    const calc = calcTrueNoteScoreBasic(songClear, beatmaps, balancedBase);
    if (calc) {
      return calc;
    }

    console.log('did not calculate true note score', {
      scBase: songClear.scoreBase,
      scTotal: songClear.scoreTotal,
      themeLevel: songClear.themeLevel,
      difficulty: songClear.difficulty,
      hM: songClear.hitMiss,
      hG: songClear.hitGood,
      hP: songClear.hitPerfect,
      hSP: songClear.hitSuperPerfect,
    });
    return;
  }
  const baseScoreUnequipped =
    songClear.difficulty === 'Hard' ? 60000 : songClear.difficulty === 'Normal' ? 54000 : 48000;
  return calcTrueNoteScoreBasic(songClear, beatmaps, baseScoreUnequipped);
}

function calcTrueNoteScoreBasic(songClear: SongClear, beatmaps: Dictionary<SongBeatmap>, baseScore: number) {
  const beatmap = beatmaps[songClear.difficulty];
  const countNotesTotal = beatmap.countNotesTotal;
  const spPerNote = baseScore / countNotesTotal;
  const pPerNote = Math.round(baseScore / countNotesTotal / 2);
  const gPerNote = Math.round(baseScore / countNotesTotal / 8);

  const rawScoreBase =
    songClear.scoreBase -
    (songClear.scoreThemeGradeBonus || calculateThemeBonus(songClearCardsToCards(songClear.cards)));
  const gap = baseScore - rawScoreBase;

  if (
    rawScoreBase === baseScore ||
    (songClear.hitSuperPerfect && songClear.hitPerfect === 0 && songClear.hitGood === 0 && songClear.hitMiss === 0)
  ) {
    // straight FSP
    return {
      hitSuperPerfect: countNotesTotal,
    };
  }

  if (songClear.hitGood === 0) {
    // FP
    const diffFPPerfect = gap / 2;
    return {
      hitSuperPerfect: Math.round(rawScoreBase / spPerNote),
      hitPerfect: Math.round(diffFPPerfect / pPerNote),
      hitGood: 0,
      hitMiss: 0,
    };
  }

  const rangeP = songClear.hitPerfect ? _.range(1, songClear.hitPerfect + 1) : [0];
  const rangeG = _.range(1, songClear.hitGood + 1);
  const rangeX = _.flatMap(rangeP, pCount =>
    rangeG.map(gCount => {
      const spCount = countNotesTotal - pCount - gCount;
      const rawDistance = rawScoreBase - (spCount * spPerNote + pCount * pPerNote + gCount * gPerNote);
      return {
        spCount,
        pCount,
        gCount,
        distance: Math.abs(rawDistance),
        rawDistance,
      };
    }),
  );
  const lowest = _.minBy(rangeX, 'distance');
  console.log(_.sortBy(rangeX, 'distance'), lowest);

  return {
    hitSuperPerfect: lowest.spCount,
    hitPerfect: lowest.pCount,
    hitGood: lowest.gCount,
    hitMiss: 0,
  };
}

export function calcThemeLevel(cards: SongClearCard[]) {
  const groups = _.groupBy(cards, card => card.theme?.guid || 'no-theme');
  const entries = Object.entries(groups);
  const totalCount = cards.length;
  const lvl1 = Math.ceil(totalCount * 0.33);
  const lvl2 = Math.ceil(totalCount * 0.66);

  const entriesWithTheme = entries.filter(([key]) => key !== 'no-theme');
  if (entriesWithTheme.length === 0) {
    return 0;
  }
  const biggestGroup = _.maxBy(entriesWithTheme, ([, group]) => group.length);
  const biggestGroupCount = biggestGroup[1]?.length;
  if (biggestGroupCount === totalCount) {
    return 3;
  } else if (biggestGroupCount >= lvl2) {
    return 2;
  } else if (biggestGroupCount >= lvl1) {
    return 1;
  }

  return 0;
}
