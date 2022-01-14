import { DateNumber } from '../../dalcom';

export type AllGameInfo =
  | ArenaInfoData
  | ArenaRewardData
  | ArtistData
  | AttendanceConsecutiveData
  | AttendanceData
  | CardBalanceData
  | CardData
  | CardGradeBonusData
  | CardIntensifyData
  | CardInvenExpandStoreData
  | CardPackYearData
  | CardSellData
  | CardStoreData
  | CashPurchaseEventData
  | CollectEventData
  | CollectionAchievementData
  | CollectionPointData
  | ComebackAttendanceData
  | CommonData
  | DalcomStageMusicData
  | DalcomStageRewardData
  | DiamondStoreData
  | EventManagementData
  | EventMissionData
  | ExtraResourceData
  | FreePassRewardData
  | GameConfigData
  | GroupData
  | MajorGroupData
  | HeadphoneStoreData
  | HelpData
  | HiddenGameData
  | InputCharRangeData
  | IntensifyEventData
  | LanguageData
  | LeagueWeeklyInfoData
  | LeagueWeeklyRewardData
  | LiveThemeCardData
  | LiveThemeData
  | LiveThemeGifData
  | LiveThemeSoundData
  | LobbyBgData
  | LobbyBgStoreData
  | LocaleData
  | LocalePopupData
  | MemberData
  | MembershipData
  | MissionData
  | MissionDetailData
  | MusicData
  | MyRecordData
  | NewsData
  | NpcData
  | PassMissionData
  | PointRewardData
  | PopupHelpData
  | PopupStoreData
  | PremiumPassRewardData
  | PrismData
  | ProfileData
  | ProvidableItem
  | RecommendStoreData
  | RhythmPointStoreData
  | SelectCardData
  | SpecialStoreData
  | SpecialUserData
  | StarPassData
  | StarPassStoreData
  | ThemeData
  | ThemeTypeData
  | UpdateNoticeData
  | URLs
  | VoiceData
  | VoiceResourceData
  | WordFilterData
  | WorldRecordData;

export interface ArenaInfoData {
  entryRewardValue2: number;
  backgroundURL: number;
  payment1: number;
  code: number;
  entryRewardValue1: number;
  payment2: number;
  entryRewardIcon2: number;
  entryRewardIcon1: number;
  entryLeague: number;
  entryRewardItem2: number;
  entryFeeItem1: number;
  averageRankingMin: number;
  entryFeeItem2: number;
  entryRewardItem1: number;
  startAt: DateNumber;
  ArenaLocale: string;
  averageRankingMax: number;
  ArenaIcon: number;
  entryFeeIcon1: number;
  endAt: DateNumber;
  entryFeeIcon2: number;
  dailyRewardValue: number;
  helpLocale4: number;
  helpLocale3: number;
  entryFeeValue2: number;
  helpLocale6: number;
  entryFeeValue1: number;
  helpLocale5: number;
  dailyRewardItem: number;
  helpLocale2: number;
  helpLocale1: number;
}

export interface ArenaRewardData {
  code: number;
  rewardValue: number;
  itemCategory: number;
  gradeMax: number;
  rewardItem: number;
  gradeMin: number;
  rankingLocale: number;
}

export interface ArtistData {
  birthday: number;
  analyticsData: string;
  nameImage: number;
  code: number;
  isProfileImage: boolean;
  emptyImageLarge: number;
  emptyImageSmall: number;
  profileImage: number;
  debut: number;
  orderIndex: number;
  debutAlbum: number;
  position?: any;
  localeName: number;
  group: number;
}

export interface AttendanceConsecutiveData {
  code: number;
  months: number;
  quantity: number;
  year: number;
  iconType: number;
  icon: number;
  consecutive: number;
}

export interface AttendanceData {
  birthday?: any;
  headerIconType?: any;
  iconType8?: any;
  code: number;
  iconType7?: any;
  iconType6?: any;
  iconType5?: any;
  iconType4?: any;
  iconType3?: any;
  years: number;
  eventTitle?: any;
  quantity1: number;
  months: number;
  quantity2?: any;
  quantity7?: any;
  icon7?: any;
  quantity8?: any;
  icon8?: any;
  icon5?: any;
  birthdayName?: any;
  eventType: number;
  icon6?: any;
  quantity3?: any;
  icon3?: any;
  quantity4?: any;
  icon4?: any;
  icon1: number;
  quantity5?: any;
  icon2?: any;
  quantity6?: any;
  iconType2?: any;
  days: number;
  iconType1: number;
}

export interface CardBalanceData {
  maxEnergy: number;
  minEnergy: number;
  code: number;
  minScore: number;
  prizmScore: number;
  maxScore: number;
}

export interface CardData {
  code: number;
  intensifyPercentage: number;
  groupID: number;
  artistID: number;
  isSelect: boolean;
  cardImageLarge: number;
  type: number;
  material: number;
  sellStartAt: number;
  percentage: number;
  theme: number;
  sellEndAt: number;
  prism?: number;
  cardImageSmall: number;
}

export interface CardGradeBonusData {
  gradeValue: number;
  code: number;
  cardBookValue: number;
  maxGradeValue: number;
  minGradeValue: number;
  abilityValue: number;
}

export interface CardIntensifyData {
  R73Price: number;
  R90Price: number;
  C2Price: number;
  R42Price: number;
  R87Price: number;
  A1: number;
  R21: number;
  A2: number;
  R20: number;
  R25Price: number;
  A3: number;
  R23: number;
  R7Price: number;
  A4: number;
  R22: number;
  A5: number;
  R25: number;
  R24: number;
  R27: number;
  R26: number;
  A5Price: number;
  R29: number;
  R28: number;
  R56Price: number;
  R11Price: number;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
  R58Price: number;
  R5: number;
  R6: number;
  R7: number;
  R8: number;
  R9: number;
  R5Price: number;
  R44Price: number;
  R71Price: number;
  R30: number;
  R39Price: number;
  B1: number;
  B2: number;
  R32: number;
  R85Price: number;
  B3: number;
  R31: number;
  B4: number;
  R34: number;
  B5: number;
  R33: number;
  R99Price: number;
  R36: number;
  R35: number;
  R38: number;
  R37: number;
  R39: number;
  S1: number;
  S2: number;
  S3: number;
  S4: number;
  S5: number;
  R29Price: number;
  R92Price: number;
  R23Price: number;
  C1: number;
  R41: number;
  C2: number;
  R40: number;
  A3Price: number;
  C3: number;
  R43: number;
  C4: number;
  R42: number;
  C5: number;
  R45: number;
  R44: number;
  R47: number;
  R46: number;
  R49: number;
  R48: number;
  R61Price: number;
  R83Price: number;
  R13Price: number;
  R89Price: number;
  R50: number;
  R52: number;
  R51: number;
  R54: number;
  R53: number;
  R56: number;
  R55: number;
  R58: number;
  R57: number;
  S4Price: number;
  R32Price: number;
  R59: number;
  R100: number;
  R54Price: number;
  R35Price: number;
  B4Price: number;
  R20Price: number;
  R65Price: number;
  R95Price: number;
  R61: number;
  R50Price: number;
  R60: number;
  R18Price: number;
  R63: number;
  R62: number;
  R65: number;
  R64Price: number;
  R64: number;
  R67: number;
  R66: number;
  R69: number;
  R68: number;
  R17Price: number;
  S3Price: number;
  R66Price: number;
  R2Price: number;
  R70: number;
  R72: number;
  R71: number;
  R74: number;
  R73: number;
  R47Price: number;
  R76: number;
  R75: number;
  R78: number;
  R77: number;
  R79: number;
  R93Price: number;
  B5Price: number;
  R31Price: number;
  R37Price: number;
  R81: number;
  R3Price: number;
  R80: number;
  R83: number;
  R82: number;
  R84Price: number;
  R85: number;
  R84: number;
  R87: number;
  R86: number;
  R89: number;
  R88: number;
  R36Price: number;
  R30Price: number;
  R75Price: number;
  S2Price: number;
  R94Price: number;
  C4Price: number;
  R90: number;
  R92: number;
  R21Price: number;
  R91: number;
  R94: number;
  R93: number;
  R96: number;
  R95: number;
  R98: number;
  R97: number;
  R40Price: number;
  R99: number;
  R46Price: number;
  R9Price: number;
  R27Price: number;
  R6Price: number;
  R26Price: number;
  R72Price: number;
  R41Price: number;
  R69Price: number;
  R8Price: number;
  R60Price: number;
  R55Price: number;
  R74Price: number;
  R12Price: number;
  A4Price: number;
  C3Price: number;
  R88Price: number;
  R76Price: number;
  R70Price: number;
  R45Price: number;
  R4Price: number;
  R22Price: number;
  R28Price: number;
  R98Price: number;
  C5Price: number;
  R67Price: number;
  R16Price: number;
  R86Price: number;
  B3Price: number;
  R10Price: number;
  S1Price: number;
  R57Price: number;
  R38Price: number;
  R19Price: number;
  R51Price: number;
  R34Price: number;
  R48Price: number;
  R81Price: number;
  R79Price: number;
  R1Price: number;
  S5Price: number;
  R33Price: number;
  R78Price: number;
  R80Price: number;
  R100Price: number;
  R52Price: number;
  R63Price: number;
  R82Price: number;
  B2Price: number;
  A1Price: number;
  R77Price: number;
  R96Price: number;
  code: number;
  R62Price: number;
  R68Price: number;
  R15Price: number;
  B1Price: number;
  R53Price: number;
  R59Price: number;
  A2Price: number;
  R14Price: number;
  C1Price: number;
  R91Price: number;
  R97Price: number;
  R24Price: number;
  R10: number;
  R43Price: number;
  R12: number;
  R11: number;
  R14: number;
  R13: number;
  R16: number;
  R15: number;
  R49Price: number;
  R18: number;
  R17: number;
  R19: number;
}

export interface CardInvenExpandStoreData {
  analyticsData: string;
  product: number;
  code: number;
  quantity: number;
  paymentCategory: number;
  productSmallImage: number[];
  bonusQuantity: number;
  eventCode: string;
  currentExpandCount: number;
  productImage: number[];
  sellStartAt?: any;
  price: number;
  sellEndAt?: any;
}

export interface CardPackYearData {
  theme2?: any;
  themeList?: any;
  code: number;
  theme1?: any;
  artist?: any;
  cardGrade?: any;
  groupID2?: any;
  name: string;
  groupID1?: any;
  category: number;
  selectedCode?: number[];
}

export interface CardSellData {
  code: number;
  price: number;
}

export interface CardStoreData {
  analyticsData: string;
  product: number;
  code: number;
  quantity: number;
  paymentCategory: number;
  description: number;
  cardpackimage: number;
  bonusQuantity: number;
  eventCode: string;
  productImage: number[];
  sellStartAt?: any;
  price: number;
  orderIndex: number;
  sellEndAt?: any;
}

export interface CashPurchaseEventData {
  diamondStoreCode: number;
  analyticsData: string;
  buyCount: number;
  code: number;
  productImage: number[];
  paymentCategory: number;
  endAt: any;
  startAt: any;
}

export interface CollectEventData {
  code: number;
  eventDescLocale: number;
  DescLocale2: number;
  TitleLocale: number;
  DescLocale1: number;
  openItemValue1: number;
  openItemValue2: number;
  openItemValue3: number;
  eventItemImage: number;
  openItemCooltime2: number;
  openItemCooltime1: number;
  paymentItem: number;
  itemLocale: number;
  openItemMaxcount: number;
  eventBgImage: number;
}

export interface CollectionAchievementData {
  rewardIcon: number;
  scoreQuantity?: any;
  code: number;
  pointValue: number;
  level: number;
  collectionPointType: number;
  rewardQuantity: number;
  missionLocale: number;
  rewardItem: number;
}

export interface CollectionPointData {
  code: number;
  pointValue: number;
  cardGrade?: number;
  collectionPointType: number;
}

export interface ComebackAttendanceData {
  localeName4: number;
  localeName3: number;
  localeName2: number;
  code: number;
  localeName1: number;
  iconType7: number;
  iconType6: number;
  iconType5: number;
  iconType4: number;
  iconType3: number;
  localeName7: number;
  localeName6: number;
  localeName5: number;
  quantity1: number;
  quantity2: number;
  quantity7: number;
  icon7: number;
  icon5: number;
  icon6: number;
  quantity3: number;
  icon3: number;
  quantity4: number;
  icon4: number;
  icon1: number;
  quantity5: number;
  icon2: number;
  quantity6: number;
  iconType2: number;
  iconType1: number;
}

export interface CommonData {
  sV02?: any;
  iV04?: number;
  sV01?: any;
  iV03?: number;
  sV04?: any;
  code: number;
  sV03?: any;
  iV05?: number;
  sV05?: any;
  iV02?: number;
  isEnable: boolean;
  iV01: number;
}

export interface DalcomStageMusicData {
  code: number;
}

export interface DalcomStageRewardData {
  rewardName1: number;
  code: number;
  rangeMin?: number;
  icon5?: any;
  rewardItem: string;
  icon3?: any;
  rewardName4?: any;
  icon4?: any;
  rewardName5?: any;
  gradeMin?: number;
  icon1: number;
  rewardName2: number;
  icon2: number;
  rewardName3?: any;
  rangeMax?: number;
  gradeMax?: number;
  localeName: number;
}

export interface DiamondStoreData {
  analyticsData: string;
  code: number;
  quantity: number;
  bonusQuantity: number;
  productImage: number[];
  sellStartAt?: any;
  price: number;
  orderIndex: number;
  targetDevice: number;
  analyticsPrice: number;
  sku: string;
  sellEndAt?: any;
  currencyCode: string;
}

export interface EventManagementData {
  code: number;
  eventImageMain: number[];
  eventImageTailbg: number[];
  eventItemEndAt?: number;
  eventType: number;
  eventNameLocale: number;
  eventEndAt: any;
  eventCode: number;
  eventImageTail: number[];
  helpDescLocale: number;
  eventStartAt: any;
  orderIndex: number;
  eventImageHead: number[];
  eventGroupCode?: number;
}

export interface EventMissionData {
  item: number;
  code: number;
  titleLocale: number;
  backgroundImage?: number;
  itemIcon: number;
  uri: string;
  conditionCode: number;
  eventCode: number;
  descLocale: number;
  itemName: number;
  missionDescLocale?: number;
  orderIndex: number;
  rewardQuantity: number;
  tabTitleLocale?: number;
  value: number;
  groupCode: number;
}

export interface ExtraResourceData {
  code: number;
  url: number;
}

export interface FreePassRewardData {
  code: number;
  passExperience: number;
  passCumulativeExperience: number;
  starPassID: number;
  freePassItemIcon?: number;
  passTier: number;
  freePassRewardQuantity?: number;
}

export interface GameConfigData {
  /** Often a date string */
  stringValue: any;
  code: number;
  floatValue?: number;
  integerValue?: number;
  booleanValue?: boolean;
}

export interface GroupData {
  profileGroupName: number;
  analyticsData: string;
  bestCardbookImage: number;
  groupType: number;
  code: number;
  integrateCode?: any;
  displayStartAt?: number;
  emblemIndex?: number;
  emblemBuiltInResId: string;
  equipableSlot: number;
  cardLocaleName: number;
  orderIndex: number;
  displayEndAt?: number;
  localeName: number;
  secondOrderIndex: number;
  emblemImage: number;
}

export interface MajorGroupData {
  analyticsData: string;
  code: number;
  integrateLocale: number;
  emblemImage: number;
}

export interface HeadphoneStoreData {
  eventCode: string;
  analyticsData: string;
  code: number;
  quantity: number;
  productImage: number[];
  sellStartAt?: any;
  itemCategory: number;
  price: number;
  orderIndex: number;
  sellEndAt?: any;
  bonusQuantity: number;
}

export interface HelpData {
  groupName: number;
  code: number;
  tabTitle: number;
  contentsKR: string;
  orderIndex: number;
  contentTitle: number;
  contentsUS: string;
  group: number;
}

export interface HiddenGameData {
  conditionScript: string;
  loadingImage: number;
  code: number;
  rate: number;
  musicCode: number;
  forceDifficult: number;
}

export interface InputCharRangeData {
  code: number;
  min: string;
  max: string;
}

export interface IntensifyEventData {
  code: number;
  priceRate: number;
  groupID?: any;
  allCard: boolean;
  artistID?: any;
  theme?: any;
  probabilityRate: number;
  endAt: any;
  startAt: any;
}

export interface LanguageData {
  code: number;
  value: string;
}

export interface LeagueWeeklyInfoData {
  promote: number;
  rateLocale: number;
  code: number;
  bonusLocale: number;
  rate: number;
  className: number;
  tipImage: number;
  classColor: string;
  degrade: number;
}

export interface LeagueWeeklyRewardData {
  itemType: number;
  code: number;
  quantity: number;
  paymentCategory: number;
  grade: number;
  leagueClass: number;
  endAt?: number;
  startAt?: number;
}

export interface LiveThemeCardData {
  liveThemeGifID: number;
  analyticsData: string;
  code: number;
  liveThemeSoundID: number;
  emptyImageLarge: number;
  emptyImageSmall: number;
  artistID: number;
  liveThemeImageLarge: number;
  liveThemeSignSmall?: any;
  artistBgImage: number;
  liveThemeSignLarge?: any;
  removeBGImageLarge?: any;
  liveThemeImageSmall: number;
  liveThemeID: number;
}

export interface LiveThemeData {
  saleLocaleName: number;
  analyticsData: string;
  code: number;
  groupID: number;
  orderIndex: number;
  liveThemeEffect?: any;
  liveThemeAuraColor: string;
  localeName: number;
  liveThemeAuraPreset: number;
}

export interface LiveThemeGifData {
  gifSound: boolean;
  analyticsData: string;
  code: number;
  liveThemeGif: number;
}

export interface LiveThemeSoundData {
  analyticsData: string;
  code: number;
  liveThemeSound: number;
}

export interface LobbyBgData {
  productFontColor: string;
  analyticsData: string;
  code: number;
  bgImageLarge: number;
  groupID: number;
  bgImageSmall: number;
  bgName: number;
  productBgColor: string;
}

export interface LobbyBgStoreData {
  isLink: boolean;
  analyticsData: string;
  product: number;
  code: number;
  sellName?: number;
  paymentCategory?: number;
  bgPrice: number;
  description: number;
  sellType: number;
  bgSku?: any;
  lobbyBgID: number;
  sellStartAt?: number;
  orderIndex: number;
  targetDevice?: any;
  eventManagementID?: number;
  analyticsPrice?: any;
  sellEndAt?: number;
  currencyCode?: any;
}

export interface LocaleData {
  zhCN: string | number;
  code: number;
  esES: string | number;
  idID: string | number;
  enUS: string | number;
  zhTW: string | number;
  koKR: string | number;
  trTR: string | number;
  ptPT: string | number;
  jpJP: string | number;
  arAR: string | number;
}

export interface LocalePopupData {
  msgs: number[];
  code: number;
  icon: number;
  btns: number[];
  title: number;
}

export interface MemberData {
  buttonImage: number;
  largeImage: number;
  nameImage: number;
  code: number;
  greeting: number;
  profile: number;
  voiceScrpitPositionY: number;
  voiceScrpitPositionX: number;
  UIReadyBT: number;
  UIStartBT: number;
  emptyLiveImage: number;
  name: number;
  profileCode: number;
  signImage: number;
  UIMusicSelectBT: number;
}

export interface MembershipData {
  packageItem: string;
  code: number;
  icon: number;
  days: number;
}

export interface MissionData {
  descLocale: number;
  item: number;
  itemName: number;
  code: number;
  titleLocale: number;
  itemIcon: number;
  orderIndex: number;
  rewardQuantity: number;
  type: number;
  value: number;
  uri: string;
  conditionCode: number;
}

export interface MissionDetailData {
  /** encoded json */
  conditionScript: string;
  code: number;
  type: number;
}

export interface MusicData {
  albumName: number;
  analyticsData: string;
  linkedMusic?: any;
  code: number;
  myrecordQualifyingScore: number;
  seqNormal: number;
  sound: number;
  seqHard: number;
  artistCode: string;
  cardRotation: number;
  normalPatternCount: number;
  isLocked: boolean;
  worldrecordQualifyingScore: number;
  groupData: number;
  albumFontColor: string;
  seqEasy: number;
  image: number;
  trackNumber: number;
  /** unix timestamp */
  releaseDate: number;
  composer?: any;
  album: number;
  isMultiTempo: boolean;
  hardPatternCount: number;
  easyPatternCount: number;
  challengable: boolean;
  isHidden: boolean;
  twoStarMaxMiss: number;
  orderIndex: number;
  previewSound: number;
  localeDisplayGroupName: number;
  oneStarMaxMiss: number;
  localeName: number;
  secondOrderIndex: number;
  musicType: string;
  albumBgColor: string;
  threeStarMaxMiss: number;
}

export interface MyRecordData {
  quantity1: number;
  code: number;
  quantity2: number;
  clearMusicMax: number;
  icon5?: any;
  icon3: number;
  quantity3: number;
  endAt: any;
  icon4?: any;
  quantity4?: any;
  icon1: number;
  quantity5?: any;
  icon2: number;
  clearMusicMin: number;
  startAt: any;
}

export interface NewsData {
  image: number;
  externalUrl: number;
  code: number;
  targetLanguage: number;
  orderIndex: number;
  endAt: number;
  uri: string;
  startAt: number;
}

export interface NpcData {
  code: number;
  nickname: number;
  artistID: number;
}

export interface PassMissionData {
  item: number;
  code: number;
  titleLocale: number;
  weeklyMissionType: number;
  itemIcon: number;
  uri: string;
  conditionCode: number;
  descLocale: number;
  itemName: number;
  starPassID: number;
  orderIndex: number;
  rewardQuantity: number;
  dailyMissionType?: number;
  value: number;
}

export interface PointRewardData {
  rewardName: number;
  code: number;
  pointMaximum: number;
  quantity: number;
  description: number;
  saveEndAt: any;
  saveStartAt: any;
  pointColor: string;
}

export interface PopupHelpData {
  code: number;
  titleLocale: number;
  Image2: number[];
  Image1: number[];
  description: number[];
}

export interface PopupStoreData {
  actionCount: number;
  analyticsData: string;
  buyCount: number;
  code: number;
  quantity: number;
  dayCount: number;
  printSight: number;
  description: number;
  popupMessage: number;
  bonusQuantity: number;
  popupSubject: number;
  actionType: number;
  productImage: number[];
  onedaySell: boolean;
  sellStartAt: any;
  price: number;
  orderIndex: number;
  targetDevice: number;
  analyticsPrice: number;
  sku: string;
  sellEndAt: any;
  currencyCode: string;
}

export interface PremiumPassRewardData {
  preview: boolean;
  code: number;
  premiumPassQuantity: number;
  premiumPassItemIcon: number;
  starPassID: number;
  passTier: number;
  previewImage: number[];
}

export interface PrismData {
  code: number;
  prismLocale: string;
  prismImageLarge: number;
  serverDataUse: boolean;
  prismImageSmall: number;
}

export interface ProfileData {
  analyticsData: string;
  code: number;
  groupID: number;
  purchase: number;
  artistID: number;
  eventType: number;
  profileImage: number;
  endAt?: any;
  paymentType?: any;
  eventCode: string;
  profileType: number;
  price: number;
  orderIndex: number;
  startAt?: any;
}

export interface ProvidableItem {
  item: string;
  code: number;
  category: string;
}

export interface RecommendStoreData {
  analyticsData: string;
  code: number;
  description: number;
  productSmallImage: number[];
  sellType: number;
  paymentType: number;
  bonusQuantity: number;
  totalBuyCount?: number;
  productImage: number[];
  price: number;
  targetDevice: number;
  sku: string;
  pointReward?: number;
  getPoint?: number;
  linkData: string;
  product?: number;
  buyCount: number;
  quantity: number;
  paymentCategory?: number;
  sellStartAt: any;
  onedaySell: boolean;
  liveThemePackageID?: any;
  orderIndex: number;
  analyticsPrice?: number;
  sellEndAt: any;
  currencyCode: string;
}

export interface RhythmPointStoreData {
  eventCode: string;
  analyticsData: string;
  code: number;
  quantity: number;
  productImage: number[];
  sellStartAt?: any;
  price: number;
  orderIndex: number;
  sellEndAt?: any;
  bonusQuantity: number;
}

export interface SelectCardData {
  cardData: string;
  code: number;
  productImage: number;
  level: number;
  grade: number;
  groupData?: any;
}

export interface SpecialStoreData {
  payment1: number;
  analyticsData: string;
  parentsID?: number;
  code: number;
  quantity: number;
  itemCategory: number;
  payment2?: any;
  ItemDetailCode: number;
  description: number;
  productSmallImage: number[];
  inventory: boolean;
  bonusQuantity: number;
  productImage: number[];
  sellStartAt?: any;
  orderIndex: number;
  sellEndAt?: any;
  price1: number;
  price2?: number;
}

export interface SpecialUserData {
  code: number;
  effectCode: number;
  imageCode: number;
  nicknameColor: string;
}

export interface StarPassData {
  passEndAt: any;
  analyticsData: string;
  code: number;
  passMaxTier: number;
  passStartAt: any;
  tierPrice: number;
}

export interface StarPassStoreData {
  analyticsData: string;
  code: number;
  passSku: string;
  description: number;
  passName: number;
  passPrice: number;
  productImage: number[];
  sellStartAt: any;
  starPassID: number;
  targetDevice: number;
  analyticsPrice: number;
  sellEndAt: any;
  currencyCode: string;
}

export interface ThemeData {
  nameImageSmall: number;
  analyticsData: string;
  code: number;
  nameImageLarge: number;
  themePercentage: number;
  selectRate: number;
  orderIndex: number;
  limitedType: number;
  rehearsalTheme: boolean;
  themeTypeCode: number;
  cardbookMarkCode: string;
  localeName: number;
}

export interface ThemeTypeData {
  animationTime?: any;
  code: number;
  themePosition?: any;
  backgroundImage?: any;
  gradeS: number[];
  gradeR: number[];
  backgroundAnimation?: any;
  emblemPosition: string;
  animationCount?: any;
  namePosition?: any;
  gradeC: number[];
  gradeB: number[];
  gradeA: number[];
}

export interface UpdateNoticeData {
  image: number;
  showLimit: number;
  code: number;
  targetLanguage: number;
  subject: string;
  orderIndex: number;
  description: string;
  endAt: number;
  startAt: number;
}

export interface URLs {
  code: number;
  size: number;
  modifiedAt: string;
  version: string;
  isExist: boolean;
  url: string;
}

export interface VoiceData {
  code: number;
  playType: number;
  voiceResource: string;
  voiceUse: boolean;
  voicePlaybackTime: number;
}

export interface VoiceResourceData {
  code: number;
  voiceSound: number;
  voiceScript?: number;
}

export interface WordFilterData {
  code: number;
  keyword: string;
}

export interface WorldRecordData {
  quantity1: number;
  code: number;
  quantity2: number;
  seasonCode: number;
  icon5?: any;
  endAt: any;
  icon3: number;
  quantity3: number;
  version: boolean;
  icon4?: any;
  quantity4?: any;
  icon1: number;
  quantity5?: any;
  icon2: number;
  rank?: number;
  startAt: any;
}
