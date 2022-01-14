import {
  ArenaInfoData,
  ArenaRewardData,
  ArtistData,
  AttendanceConsecutiveData,
  AttendanceData,
  CardBalanceData,
  CardData,
  CardGradeBonusData,
  CardIntensifyData,
  CardInvenExpandStoreData,
  CardPackYearData,
  CardSellData,
  CardStoreData,
  CashPurchaseEventData,
  CollectEventData,
  CollectionAchievementData,
  CollectionPointData,
  ComebackAttendanceData,
  CommonData,
  DalcomStageMusicData,
  DalcomStageRewardData,
  DiamondStoreData,
  EventManagementData,
  EventMissionData,
  ExtraResourceData,
  FreePassRewardData,
  GameConfigData,
  GroupData,
  HeadphoneStoreData,
  HelpData,
  HiddenGameData,
  InputCharRangeData,
  IntensifyEventData,
  LanguageData,
  LeagueWeeklyInfoData,
  LeagueWeeklyRewardData,
  LiveThemeCardData,
  LiveThemeData,
  LiveThemeGifData,
  LiveThemeSoundData,
  LobbyBgData,
  LobbyBgStoreData,
  LocaleData,
  LocalePopupData,
  MajorGroupData,
  MemberData,
  MembershipData,
  MissionData,
  MissionDetailData,
  MusicData,
  MyRecordData,
  NewsData,
  NpcData,
  PassMissionData,
  PointRewardData,
  PopupHelpData,
  PopupStoreData,
  PremiumPassRewardData,
  PrismData,
  ProfileData,
  ProvidableItem,
  RecommendStoreData,
  RhythmPointStoreData,
  SelectCardData,
  SpecialStoreData,
  SpecialUserData,
  StarPassData,
  StarPassStoreData,
  ThemeData,
  ThemeTypeData,
  UpdateNoticeData,
  URLs,
  VoiceData,
  VoiceResourceData,
  WordFilterData,
  WorldRecordData,
} from './gameinfo';

import { promisify } from 'util';
import { readFile, exists } from 'fs';
import { join } from 'path';

const readFile$ = promisify(readFile);
// tslint:disable-next-line: deprecation
const exists$ = promisify(exists);

async function loadFileGeneric<R>(key: string, dir: string): Promise<R[]> {
  const filepath = join(dir, key + '.json');
  if (!(await exists$(filepath))) {
    throw new Error(`File ${key}.json does not exist in ${dir}.`);
  }
  const contents = await readFile$(filepath);
  return JSON.parse(contents.toString());
}

export async function loadArenaInfoData(dir: string): Promise<ArenaInfoData[]> {
  return loadFileGeneric<ArenaInfoData>('ArenaInfoData', dir);
}
export async function loadArenaRewardData(
  dir: string,
): Promise<ArenaRewardData[]> {
  return loadFileGeneric<ArenaRewardData>('ArenaRewardData', dir);
}
export async function loadArtistData(dir: string): Promise<ArtistData[]> {
  return loadFileGeneric<ArtistData>('ArtistData', dir);
}
export async function loadAttendanceConsecutiveData(
  dir: string,
): Promise<AttendanceConsecutiveData[]> {
  return loadFileGeneric<AttendanceConsecutiveData>(
    'AttendanceConsecutiveData',
    dir,
  );
}
export async function loadAttendanceData(
  dir: string,
): Promise<AttendanceData[]> {
  return loadFileGeneric<AttendanceData>('AttendanceData', dir);
}
export async function loadCardBalanceData(
  dir: string,
): Promise<CardBalanceData[]> {
  return loadFileGeneric<CardBalanceData>('CardBalanceData', dir);
}
export async function loadCardData(dir: string): Promise<CardData[]> {
  return loadFileGeneric<CardData>('CardData', dir);
}
export async function loadCardGradeBonusData(
  dir: string,
): Promise<CardGradeBonusData[]> {
  return loadFileGeneric<CardGradeBonusData>('CardGradeBonusData', dir);
}
export async function loadCardIntensifyData(
  dir: string,
): Promise<CardIntensifyData[]> {
  return loadFileGeneric<CardIntensifyData>('CardIntensifyData', dir);
}
export async function loadCardInvenExpandStoreData(
  dir: string,
): Promise<CardInvenExpandStoreData[]> {
  return loadFileGeneric<CardInvenExpandStoreData>(
    'CardInvenExpandStoreData',
    dir,
  );
}
export async function loadCardPackYearData(
  dir: string,
): Promise<CardPackYearData[]> {
  return loadFileGeneric<CardPackYearData>('CardPackYearData', dir);
}
export async function loadCardSellData(dir: string): Promise<CardSellData[]> {
  return loadFileGeneric<CardSellData>('CardSellData', dir);
}
export async function loadCardStoreData(dir: string): Promise<CardStoreData[]> {
  return loadFileGeneric<CardStoreData>('CardStoreData', dir);
}
export async function loadCashPurchaseEventData(
  dir: string,
): Promise<CashPurchaseEventData[]> {
  return loadFileGeneric<CashPurchaseEventData>('CashPurchaseEventData', dir);
}
export async function loadCollectEventData(
  dir: string,
): Promise<CollectEventData[]> {
  return loadFileGeneric<CollectEventData>('CollectEventData', dir);
}
export async function loadCollectionAchievementData(
  dir: string,
): Promise<CollectionAchievementData[]> {
  return loadFileGeneric<CollectionAchievementData>(
    'CollectionAchievementData',
    dir,
  );
}
export async function loadCollectionPointData(
  dir: string,
): Promise<CollectionPointData[]> {
  return loadFileGeneric<CollectionPointData>('CollectionPointData', dir);
}
export async function loadComebackAttendanceData(
  dir: string,
): Promise<ComebackAttendanceData[]> {
  return loadFileGeneric<ComebackAttendanceData>('ComebackAttendanceData', dir);
}
export async function loadCommonData(dir: string): Promise<CommonData[]> {
  return loadFileGeneric<CommonData>('CommonData', dir);
}
export async function loadDalcomStageMusicData(
  dir: string,
): Promise<DalcomStageMusicData[]> {
  return loadFileGeneric<DalcomStageMusicData>('DalcomStageMusicData', dir);
}
export async function loadDalcomStageRewardData(
  dir: string,
): Promise<DalcomStageRewardData[]> {
  return loadFileGeneric<DalcomStageRewardData>('DalcomStageRewardData', dir);
}
export async function loadDiamondStoreData(
  dir: string,
): Promise<DiamondStoreData[]> {
  return loadFileGeneric<DiamondStoreData>('DiamondStoreData', dir);
}
export async function loadEventManagementData(
  dir: string,
): Promise<EventManagementData[]> {
  return loadFileGeneric<EventManagementData>('EventManagementData', dir);
}
export async function loadEventMissionData(
  dir: string,
): Promise<EventMissionData[]> {
  return loadFileGeneric<EventMissionData>('EventMissionData', dir);
}
export async function loadExtraResourceData(
  dir: string,
): Promise<ExtraResourceData[]> {
  return loadFileGeneric<ExtraResourceData>('ExtraResourceData', dir);
}
export async function loadFreePassRewardData(
  dir: string,
): Promise<FreePassRewardData[]> {
  return loadFileGeneric<FreePassRewardData>('FreePassRewardData', dir);
}
export async function loadGameConfigData(
  dir: string,
): Promise<GameConfigData[]> {
  return loadFileGeneric<GameConfigData>('GameConfigData', dir);
}
export async function loadGroupData(dir: string): Promise<GroupData[]> {
  return loadFileGeneric<GroupData>('GroupData', dir);
}
export async function loadMajorGroupData(
  dir: string,
): Promise<MajorGroupData[]> {
  return loadFileGeneric<MajorGroupData>('MajorGroupData', dir);
}
export async function loadHeadphoneStoreData(
  dir: string,
): Promise<HeadphoneStoreData[]> {
  return loadFileGeneric<HeadphoneStoreData>('HeadphoneStoreData', dir);
}
export async function loadHelpData(dir: string): Promise<HelpData[]> {
  return loadFileGeneric<HelpData>('HelpData', dir);
}
export async function loadHiddenGameData(
  dir: string,
): Promise<HiddenGameData[]> {
  return loadFileGeneric<HiddenGameData>('HiddenGameData', dir);
}
export async function loadInputCharRangeData(
  dir: string,
): Promise<InputCharRangeData[]> {
  return loadFileGeneric<InputCharRangeData>('InputCharRangeData', dir);
}
export async function loadIntensifyEventData(
  dir: string,
): Promise<IntensifyEventData[]> {
  return loadFileGeneric<IntensifyEventData>('IntensifyEventData', dir);
}
export async function loadLanguageData(dir: string): Promise<LanguageData[]> {
  return loadFileGeneric<LanguageData>('LanguageData', dir);
}
export async function loadLeagueWeeklyInfoData(
  dir: string,
): Promise<LeagueWeeklyInfoData[]> {
  return loadFileGeneric<LeagueWeeklyInfoData>('LeagueWeeklyInfoData', dir);
}
export async function loadLeagueWeeklyRewardData(
  dir: string,
): Promise<LeagueWeeklyRewardData[]> {
  return loadFileGeneric<LeagueWeeklyRewardData>('LeagueWeeklyRewardData', dir);
}
export async function loadLiveThemeCardData(
  dir: string,
): Promise<LiveThemeCardData[]> {
  return loadFileGeneric<LiveThemeCardData>('LiveThemeCardData', dir);
}
export async function loadLiveThemeData(dir: string): Promise<LiveThemeData[]> {
  return loadFileGeneric<LiveThemeData>('LiveThemeData', dir);
}
export async function loadLiveThemeGifData(
  dir: string,
): Promise<LiveThemeGifData[]> {
  return loadFileGeneric<LiveThemeGifData>('LiveThemeGifData', dir);
}
export async function loadLiveThemeSoundData(
  dir: string,
): Promise<LiveThemeSoundData[]> {
  return loadFileGeneric<LiveThemeSoundData>('LiveThemeSoundData', dir);
}
export async function loadLobbyBgData(dir: string): Promise<LobbyBgData[]> {
  return loadFileGeneric<LobbyBgData>('LobbyBgData', dir);
}
export async function loadLobbyBgStoreData(
  dir: string,
): Promise<LobbyBgStoreData[]> {
  return loadFileGeneric<LobbyBgStoreData>('LobbyBgStoreData', dir);
}
export async function loadLocaleData(dir: string): Promise<LocaleData[]> {
  return loadFileGeneric<LocaleData>('LocaleData', dir);
}
export async function loadLocalePopupData(
  dir: string,
): Promise<LocalePopupData[]> {
  return loadFileGeneric<LocalePopupData>('LocalePopupData', dir);
}
export async function loadMemberData(dir: string): Promise<MemberData[]> {
  return loadFileGeneric<MemberData>('MemberData', dir);
}
export async function loadMembershipData(
  dir: string,
): Promise<MembershipData[]> {
  return loadFileGeneric<MembershipData>('MembershipData', dir);
}
export async function loadMissionData(dir: string): Promise<MissionData[]> {
  return loadFileGeneric<MissionData>('MissionData', dir);
}
export async function loadMissionDetailData(
  dir: string,
): Promise<MissionDetailData[]> {
  return loadFileGeneric<MissionDetailData>('MissionDetailData', dir);
}
export async function loadMusicData(dir: string): Promise<MusicData[]> {
  return loadFileGeneric<MusicData>('MusicData', dir);
}
export async function loadMyRecordData(dir: string): Promise<MyRecordData[]> {
  return loadFileGeneric<MyRecordData>('MyRecordData', dir);
}
export async function loadNewsData(dir: string): Promise<NewsData[]> {
  return loadFileGeneric<NewsData>('NewsData', dir);
}
export async function loadNpcData(dir: string): Promise<NpcData[]> {
  return loadFileGeneric<NpcData>('NpcData', dir);
}
export async function loadPassMissionData(
  dir: string,
): Promise<PassMissionData[]> {
  return loadFileGeneric<PassMissionData>('PassMissionData', dir);
}
export async function loadPointRewardData(
  dir: string,
): Promise<PointRewardData[]> {
  return loadFileGeneric<PointRewardData>('PointRewardData', dir);
}
export async function loadPopupHelpData(dir: string): Promise<PopupHelpData[]> {
  return loadFileGeneric<PopupHelpData>('PopupHelpData', dir);
}
export async function loadPopupStoreData(
  dir: string,
): Promise<PopupStoreData[]> {
  return loadFileGeneric<PopupStoreData>('PopupStoreData', dir);
}
export async function loadPremiumPassRewardData(
  dir: string,
): Promise<PremiumPassRewardData[]> {
  return loadFileGeneric<PremiumPassRewardData>('PremiumPassRewardData', dir);
}
export async function loadPrismData(dir: string): Promise<PrismData[]> {
  return loadFileGeneric<PrismData>('PrismData', dir);
}
export async function loadProfileData(dir: string): Promise<ProfileData[]> {
  return loadFileGeneric<ProfileData>('ProfileData', dir);
}
export async function loadProvidableItem(
  dir: string,
): Promise<ProvidableItem[]> {
  return loadFileGeneric<ProvidableItem>('ProvidableItem', dir);
}
export async function loadRecommendStoreData(
  dir: string,
): Promise<RecommendStoreData[]> {
  return loadFileGeneric<RecommendStoreData>('RecommendStoreData', dir);
}
export async function loadRhythmPointStoreData(
  dir: string,
): Promise<RhythmPointStoreData[]> {
  return loadFileGeneric<RhythmPointStoreData>('RhythmPointStoreData', dir);
}
export async function loadSelectCardData(
  dir: string,
): Promise<SelectCardData[]> {
  return loadFileGeneric<SelectCardData>('SelectCardData', dir);
}
export async function loadSpecialStoreData(
  dir: string,
): Promise<SpecialStoreData[]> {
  return loadFileGeneric<SpecialStoreData>('SpecialStoreData', dir);
}
export async function loadSpecialUserData(
  dir: string,
): Promise<SpecialUserData[]> {
  return loadFileGeneric<SpecialUserData>('SpecialUserData', dir);
}
export async function loadStarPassData(dir: string): Promise<StarPassData[]> {
  return loadFileGeneric<StarPassData>('StarPassData', dir);
}
export async function loadStarPassStoreData(
  dir: string,
): Promise<StarPassStoreData[]> {
  return loadFileGeneric<StarPassStoreData>('StarPassStoreData', dir);
}
export async function loadThemeData(dir: string): Promise<ThemeData[]> {
  return loadFileGeneric<ThemeData>('ThemeData', dir);
}
export async function loadThemeTypeData(dir: string): Promise<ThemeTypeData[]> {
  return loadFileGeneric<ThemeTypeData>('ThemeTypeData', dir);
}
export async function loadUpdateNoticeData(
  dir: string,
): Promise<UpdateNoticeData[]> {
  return loadFileGeneric<UpdateNoticeData>('UpdateNoticeData', dir);
}
export async function loadURLs(dir: string): Promise<URLs[]> {
  return loadFileGeneric<URLs>('URLs', dir);
}
export async function loadVoiceData(dir: string): Promise<VoiceData[]> {
  return loadFileGeneric<VoiceData>('VoiceData', dir);
}
export async function loadVoiceResourceData(
  dir: string,
): Promise<VoiceResourceData[]> {
  return loadFileGeneric<VoiceResourceData>('VoiceResourceData', dir);
}
export async function loadWordFilterData(
  dir: string,
): Promise<WordFilterData[]> {
  return loadFileGeneric<WordFilterData>('WordFilterData', dir);
}
export async function loadWorldRecordData(
  dir: string,
): Promise<WorldRecordData[]> {
  return loadFileGeneric<WorldRecordData>('WorldRecordData', dir);
}
