import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SuperstarGame } from './SuperstarGame';
import { Theme } from './Theme';
import { User } from './User';
import { GradeNonEmpty, MembersGFriend, SqlBool, DropSources } from '../types';

@Entity('log_drops', { schema: 'superstar_log' })
export class CardDrop {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Index('bySource')
  @Column('enum', {
    name: 'source',
    enum: DropSources.values,
  })
  source: typeof DropSources.type;

  @Index('byType')
  @Column('varchar', { name: 'type', nullable: true, length: 255 })
  type: string | null;

  @Column('enum', {
    name: 'member',
    enum: [...MembersGFriend.values, 'Power Up'],
    nullable: true,
  })
  member: typeof MembersGFriend.type | 'Power Up';

  @Column('int', { name: 'theme_id', nullable: true, unsigned: true })
  themeId: number | null;

  @Column('enum', {
    name: 'grade',
    enum: [...GradeNonEmpty.values, '30%', '100%'],
  })
  grade: GradeNonEmpty | '30%' | '100%';

  @Index('byDate')
  @Column('datetime', { name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Index('byPrism')
  @Column('tinyint', { name: 'is_prism', unsigned: true, default: 0 })
  isPrism: SqlBool;

  @Column('text', { name: 'comment', nullable: true })
  comment: string | null;

  @Column('int', {
    name: 'user_id',
    unsigned: true,
    default: 20150115,
  })
  userId: number;

  @Column('int', { name: 'game_id', unsigned: true, default: 1 })
  gameId: number;

  @Column('varchar', {
    name: 'guid',
    nullable: true,
    unique: true,
    length: 255,
  })
  guid: string | null;

  @ManyToOne(
    () => SuperstarGame,
    (superstarGames) => superstarGames.logDrops,
    { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
  )
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game: SuperstarGame;

  @ManyToOne(() => Theme, (themes) => themes.logDrops, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'theme_id', referencedColumnName: 'id' }])
  theme: Theme;

  @ManyToOne(() => User, (users) => users.logDrops, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  get canIncreaseGrade()
  {
    switch (this.grade) {
      case 'R':
        return false;
      case 'S':
      case 'A':
      case 'B':
      case 'C':
      default:
        return true;
    }
  }

  get canDecreaseGrade()
  {
    switch (this.grade) {
      default:
      case 'C':
        return false;
      case 'R':
      case 'S':
      case 'A':
      case 'B':
        return true;
    }
  }

  decreaseGrade()
  {
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
      default:
        break;
    }
  }

  increaseGrade()
  {
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
      default:
        this.grade = 'C';
        break;
    }
  }
}
