import { StringUnion } from './string-union';

export const GradeNonEmpty = StringUnion('C', 'B', 'A', 'S', 'R');
export type GradeNonEmpty = typeof GradeNonEmpty.type;
export const Grade = StringUnion('None', ...GradeNonEmpty.values);
export type Grade = typeof Grade.type;

export type CardSystem = 50 | 99;

export const DifficultyName = StringUnion('Easy', 'Normal', 'Hard');
export type DifficultyName = typeof DifficultyName.type;
export enum Difficulty {
  Easy = 4,
  Normal = 7,
  Hard = 13,
}

export function difficultyToEnum(difficulty: DifficultyName): Difficulty
{
  switch (difficulty) {
    case 'Easy':
      return Difficulty.Easy;
    case 'Normal':
      return Difficulty.Normal;
    case 'Hard':
      return Difficulty.Hard;
  }
}

export type NumberLike = number | string;
export type SqlBool = 0 | 1;

export const MembersGFriend = StringUnion('Sowon', 'Yerin', 'Eunha', 'Yuju', 'SinB', 'Umji');
export type MembersGFriend = typeof MembersGFriend.type;

export const DropSources = StringUnion(
  'Purchase (Diamonds)',
  'Purchase (RP)',
  'Purchase ($$$)',
  'Reward',
  'Reward - Event',
  'Reward - Gift', // appeared in your inbox suddenly
  'Reward - Attendance',
  'Mission - Daily',
  'Mission - Weekly',
  'Monthly Challenges',
  'Box Event - Normal',
  'Box Event - Premium',
  'Star Pass - Normal',
  'Star Pass - Premium',
  'Challenge',
  'Clear',
  'Compensation - Maintainance',
  'Compensation - Emergency',
);
export type DropSources = typeof DropSources.type;

export class Card
{
  constructor(
    public grade: Grade,
    private _level = 1,
    public isPrism = false,
    public member?: string,
    public theme?: BasicTheme,
    public maxRLevel: CardSystem = 50,
  ) { }

  get level() { return this._level; }

  set level(_level) {
    this._level = _level;
    if (this.grade === 'R' && this._level > this.maxRLevel) {
      this._level = this.maxRLevel;
    }
    if (this._level < 1) {
      this._level = 1;
    }
  }

  get score()
  {
    let base = 0;
    let levelBonus = 4;
    switch (this.grade) {
      case 'R':
        base = 99;
        levelBonus = 2;
        if (this.maxRLevel === 99) {
          base += 1;
        }
        break;
      case 'S':
        base = 67;
        break;
      case 'A':
        base = 42;
        break;
      case 'B':
        base = 26;
        break;
      case 'C':
        base = 11;
        break;

      default:
        return -1;
    }
    const fromLevel = this.level * (levelBonus / ((this.grade === 'R' && this.maxRLevel === 99) ? 2 : 1));
    const calculated = base + fromLevel;
    return Math.floor(calculated * (this.isPrism ? 1.1 : 1));
  }

  get canIncreaseGrade()
  {
    switch (this.grade) {
      case 'R':
        return false;
      case 'S':
      case 'A':
      case 'B':
      case 'C':
      case 'None':
        return true;
    }
  }

  get canDecreaseGrade()
  {
    switch (this.grade) {
      case 'None':
        return false;
      case 'R':
      case 'S':
      case 'A':
      case 'B':
      case 'C':
        return true;
    }
  }

  decreaseGrade()
  {
    this.level = 1;
    switch (this.grade) {
      case 'R':
        this.grade = 'S';
        break;
      case 'S':
        this.grade = 'A';
        break;
      case 'A':
        this.grade = 'B';
        break;
      case 'B':
        this.grade = 'C';
        break;
      case 'C':
        this.grade = 'None';
        this.isPrism = false;
        break;
      case 'None':
        break;
    }
  }

  increaseGrade()
  {
    this.level = 1;
    switch (this.grade) {
      case 'R':
        break;
      case 'S':
        this.grade = 'R';
        break;
      case 'A':
        this.grade = 'S';
        break;
      case 'B':
        this.grade = 'A';
        break;
      case 'C':
        this.grade = 'B';
        break;
      case 'None':
        this.grade = 'C';
        break;
    }
  }

  increaseLevel()
  {
    this.level++;
    if (this.grade === 'None') {
      this.increaseGrade();
    }
    if (['C', 'B', 'A', 'S'].includes(this.grade) && this._level > 5) {
      this.increaseGrade();
    }
  }

  decreaseLevel()
  {
    this._level--;
    if (this._level < 1) {
      this.decreaseGrade();
      if (this.grade !== 'None') {
        this.level = 5;
      }
    }
  }
}

export class BasicSong
{
    constructor(
        public name: string,
        public album: string,
    ) {}
}

export class BasicTheme
{
    constructor(
        public name: string,
        public album: string,
    ) {}
}

export class IdReference
{
  id: number;
}

export class GuidReference
{
  guid: string;
}
