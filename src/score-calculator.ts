import { Card } from './types';
import _ from 'lodash';

export function calculateIdealScore(cards: Card[], themeBonus: number, cardbookBonus = 0)
{
  return Math.round((_.meanBy(cards, 'score') + 3) * 29000) + themeBonus + cardbookBonus;
}

export function calculateThemeBonus(cards: Card[])
{
  if (!cards.length) {
    return 0;
  }

  const firstTheme = cards[0].theme;
  if (cards.every(card => card.grade === 'R' && _.isEqual(firstTheme, card.theme))) {
    return 500000 + Math.min(0, (cards.length - 3) * 15000);
  }
}
