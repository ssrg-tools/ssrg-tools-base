import { Column } from 'typeorm';

export class DateParts {
  @Column('smallint', { unsigned: true, nullable: true })
  year: number;

  @Column('smallint', { unsigned: true, nullable: true })
  month: number;

  @Column('smallint', { unsigned: true, nullable: true })
  day: number;
}
