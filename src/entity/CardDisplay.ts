import { Grade, GradeNonEmpty } from '../types';
import { Column } from 'typeorm';

/**
 * Card display, referencing the exact card image instead of theme
 */
export class CardDisplay {
/** card image name, e.g. 1033 */
  @Column('int', { name: 'card_image', unsigned: true, nullable: true })
  cardImage?: number;

  @Column('varchar', { length: 5, nullable: true })
  grade?: GradeNonEmpty;

  @Column('smallint', { unsigned: true, nullable: true })
  level?: number;
}
