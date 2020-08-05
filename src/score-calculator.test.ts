import { Card } from "./types";

const testData: {
  cards: Card[],
  themeBonus: number,
  score: number,
}[] = [
  {
    cards: [
      new Card('None'),
      new Card('None'),
      new Card('None'),
    ],
    themeBonus: 0,
    score: 60000,
  },
  {
    cards: [
      new Card('B', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('B', 1, false, '', { name: 'foo', album: 'bar' }),
      new Card('None'),
      new Card('None'),
      new Card('None'),
      new Card('None'),
    ],
    themeBonus: 5000,
    score: 300000,
  },
];
