import { Card } from './types';
import _ from 'lodash';

export function calculateIdealScore(cards: Card[], themeBonus: number, cardbookBonus = 0)
{
  return ((_.meanBy(cards, 'score') + 3) * 29000) + themeBonus + cardbookBonus;
}

export function calculateThemeBonus(cards: Card[])
{
  return 545000;
}
