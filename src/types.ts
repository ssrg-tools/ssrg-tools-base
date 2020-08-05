
export type Grade = 'None' | 'C' | 'B' | 'A' | 'S' | 'R';

export type CardSystem = 50 | 99;

export class Card
{
  constructor(
    public grade: Grade,
    private _level = 1,
    public is_prism = false,
    public member?: string,
    public theme?: Theme,
    public maxRLevel: CardSystem = 50,
  ) { }

  get level() { return this._level; }

  set level(_level) {
    this._level = _level;
    if (this.grade == 'R' && this._level > this.maxRLevel) {
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
        base = 101;
        levelBonus = 2;
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
    return base
      * (this.is_prism ? 1.1 : 1)
      + this.level * levelBonus
        / (this.grade == 'R' && this.maxRLevel == 99 ? 2 : 1);
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
        this.is_prism = false;
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
    if (this.grade == 'None') {
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
      if (this.grade != 'None') {
        this.level = 5;
      }
    }
  }
}

export class Song
{
    constructor(
        public name: string,
        public album: string,
    ) {}
}

export class Theme
{
    constructor(
        public name: string,
        public album: string,
    ) {}
}
