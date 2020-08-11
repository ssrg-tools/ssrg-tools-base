import { Grade } from '../types';
import { Column } from 'typeorm';

/**
 * Card display, referencing the exact card image instead of theme
 */
export class CardDisplay {
/** card image name, e.g. 1033 */
  @Column('int', { name: 'card_image', unsigned: true })
  cardImage: number;

  @Column('varchar', { length: 5 })
  grade: Grade;

  @Column('smallint', { unsigned: true })
  level: number;
}
