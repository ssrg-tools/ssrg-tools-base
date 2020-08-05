import { Card } from './types';
import _ from 'lodash';

export function calculateIdealScore(cards: Card[], theme_bonus: number, cardbook_bonus: number)
{
  return ((_.meanBy(cards, 'score') + 3) * 29000) + theme_bonus + cardbook_bonus;
}

export function calculateThemeBonus(cards: Card[])
{
  return 545000;
}
