import { StringCBool } from '../../types';

export interface GameManifest {
  /** version number, e.g. 1.10.5, may point to the next version */
  ActiveVersion_Android: string;
  /** version number, e.g. 1.10.5, may point to the next version */
  ActiveVersion_IOS: string;
  /** url */
  ServerUrl: string;
  TermsVersion: string;
  DateOfBirth: StringCBool;
  /** url */
  MusicRankServerUrl: string;
  Cryption: StringCBool;
  OfferwallSuffix: string;
  /** url */
  MaintenanceUrl: string;
  Liapp: StringCBool;
  /** url */
  ProbabilityUrl: string;
  /** url, with {0} placeholder */
  TitleBackgroundUrl?: string;
  TitleBackgroundCount?: string;
  DalcomAccountDev: StringCBool;
  TesterIp: string[];
}
