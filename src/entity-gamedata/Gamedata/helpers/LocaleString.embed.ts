import { LocaleData } from '@base/definitions/data/gameinfo';
import { Column, Index } from 'typeorm';

export class LocaleString implements Omit<LocaleData, 'code'> {
  @Column('text', { nullable: true })
  zhCN: string;
  @Column('text', { nullable: true })
  esES: string;
  @Column('text', { nullable: true })
  idID: string;
  @Index()
  @Column('text', { nullable: true })
  enUS: string;
  @Column('text', { nullable: true })
  zhTW: string;
  @Column('text', { nullable: true })
  koKR: string;
  @Column('text', { nullable: true })
  trTR: string;
  @Column('text', { nullable: true })
  ptPT: string;
  @Column('text', { nullable: true })
  jpJP: string;
  @Column('text', { nullable: true })
  arAR: string;
}
