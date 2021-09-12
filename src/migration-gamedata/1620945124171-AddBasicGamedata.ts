import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBasicGamedata1620945124171 implements MigrationInterface {
  name = 'AddBasicGamedata1620945124171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `gamedata_artist` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `analyticsData` varchar(255) NOT NULL, `isProfileImage` tinyint NOT NULL, `orderIndex` int NOT NULL, `position` varchar(255) NULL, `group` int NOT NULL, `birthdayZhcn` text NULL, `birthdayEses` text NULL, `birthdayIdid` text NULL, `birthdayEnus` text NULL, `birthdayZhtw` text NULL, `birthdayKokr` text NULL, `birthdayTrtr` text NULL, `birthdayPtpt` text NULL, `birthdayJpjp` text NULL, `birthdayArar` text NULL, `nameImageAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `emptyImageLargeAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `emptyImageSmallAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `profileImageAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `debutZhcn` text NULL, `debutEses` text NULL, `debutIdid` text NULL, `debutEnus` text NULL, `debutZhtw` text NULL, `debutKokr` text NULL, `debutTrtr` text NULL, `debutPtpt` text NULL, `debutJpjp` text NULL, `debutArar` text NULL, `debutAlbumZhcn` text NULL, `debutAlbumEses` text NULL, `debutAlbumIdid` text NULL, `debutAlbumEnus` text NULL, `debutAlbumZhtw` text NULL, `debutAlbumKokr` text NULL, `debutAlbumTrtr` text NULL, `debutAlbumPtpt` text NULL, `debutAlbumJpjp` text NULL, `debutAlbumArar` text NULL, `localeNameZhcn` text NULL, `localeNameEses` text NULL, `localeNameIdid` text NULL, `localeNameEnus` text NULL, `localeNameZhtw` text NULL, `localeNameKokr` text NULL, `localeNameTrtr` text NULL, `localeNamePtpt` text NULL, `localeNameJpjp` text NULL, `localeNameArar` text NULL, INDEX `IDX_8fa41d33254d1da36c8d605b97` (`birthdayEnus`), INDEX `IDX_78466e5075bd4c5518c4a06239` (`debutEnus`), INDEX `IDX_8f9d20f3a644c29d0503f732ed` (`debutAlbumEnus`), INDEX `IDX_2d3c8a1ee28bd4278c40c96bfd` (`localeNameEnus`), PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
    await queryRunner.query(
      "CREATE TABLE `gamedata_card` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `intensifyPercentage` int NOT NULL, `groupID` int NOT NULL, `artistID` int NOT NULL, `isSelect` tinyint NOT NULL, `type` int NOT NULL, `material` tinyint NOT NULL, `sellStartAt` datetime NOT NULL, `sellEndAt` datetime NOT NULL, `percentage` float NOT NULL, `theme` int NOT NULL, `prism` tinyint NULL, `cardImageLargeAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `cardImageSmallAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
    await queryRunner.query(
      "CREATE TABLE `gamedata_group` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `analyticsData` varchar(255) NOT NULL, `groupType` int NOT NULL, `integrateCode` varchar(255) NULL, `displayStartAt` datetime NULL, `displayEndAt` datetime NULL, `emblemIndex` int NULL, `emblemBuiltInResId` varchar(255) NULL, `equipableSlot` int NOT NULL, `orderIndex` int NOT NULL, `secondOrderIndex` int NOT NULL, `localeNameZhcn` text NULL, `localeNameEses` text NULL, `localeNameIdid` text NULL, `localeNameEnus` text NULL, `localeNameZhtw` text NULL, `localeNameKokr` text NULL, `localeNameTrtr` text NULL, `localeNamePtpt` text NULL, `localeNameJpjp` text NULL, `localeNameArar` text NULL, `profileGroupNameZhcn` text NULL, `profileGroupNameEses` text NULL, `profileGroupNameIdid` text NULL, `profileGroupNameEnus` text NULL, `profileGroupNameZhtw` text NULL, `profileGroupNameKokr` text NULL, `profileGroupNameTrtr` text NULL, `profileGroupNamePtpt` text NULL, `profileGroupNameJpjp` text NULL, `profileGroupNameArar` text NULL, `cardLocaleNameZhcn` text NULL, `cardLocaleNameEses` text NULL, `cardLocaleNameIdid` text NULL, `cardLocaleNameEnus` text NULL, `cardLocaleNameZhtw` text NULL, `cardLocaleNameKokr` text NULL, `cardLocaleNameTrtr` text NULL, `cardLocaleNamePtpt` text NULL, `cardLocaleNameJpjp` text NULL, `cardLocaleNameArar` text NULL, `bestCardbookImageAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `emblemImageAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', INDEX `IDX_eaf7cb3a81295929b1865bdc32` (`localeNameEnus`), INDEX `IDX_0dc7a9c1e87b32151614c7a7a8` (`profileGroupNameEnus`), INDEX `IDX_7ba8e56d7f4539fc3c0c8dce24` (`cardLocaleNameEnus`), PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
    await queryRunner.query(
      "CREATE TABLE `gamedata_music` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `analyticsData` varchar(255) NOT NULL, `artistCode` text NOT NULL COMMENT 'references artist', `groupData` int NOT NULL COMMENT 'references group', `myrecordQualifyingScore` int NOT NULL, `worldrecordQualifyingScore` int NOT NULL, `linkedMusic` varchar(255) NULL, `albumFontColor` varchar(255) NOT NULL, `trackNumber` int NOT NULL, `releaseDate` datetime NOT NULL, `composer` varchar(255) NULL, `isMultiTempo` tinyint NOT NULL, `hardPatternCount` int NOT NULL, `normalPatternCount` int NOT NULL, `easyPatternCount` int NOT NULL, `challengable` tinyint NOT NULL, `isHidden` tinyint NOT NULL, `isLocked` tinyint NOT NULL, `orderIndex` int NOT NULL, `secondOrderIndex` int NOT NULL, `cardRotation` float NOT NULL, `musicType` varchar(255) NOT NULL, `albumBgColor` varchar(255) NOT NULL, `oneStarMaxMiss` float NOT NULL, `twoStarMaxMiss` float NOT NULL, `threeStarMaxMiss` float NOT NULL, `localeNameZhcn` text NULL, `localeNameEses` text NULL, `localeNameIdid` text NULL, `localeNameEnus` text NULL, `localeNameZhtw` text NULL, `localeNameKokr` text NULL, `localeNameTrtr` text NULL, `localeNamePtpt` text NULL, `localeNameJpjp` text NULL, `localeNameArar` text NULL, `localeDisplayGroupNameZhcn` text NULL, `localeDisplayGroupNameEses` text NULL, `localeDisplayGroupNameIdid` text NULL, `localeDisplayGroupNameEnus` text NULL, `localeDisplayGroupNameZhtw` text NULL, `localeDisplayGroupNameKokr` text NULL, `localeDisplayGroupNameTrtr` text NULL, `localeDisplayGroupNamePtpt` text NULL, `localeDisplayGroupNameJpjp` text NULL, `localeDisplayGroupNameArar` text NULL, `albumNameZhcn` text NULL, `albumNameEses` text NULL, `albumNameIdid` text NULL, `albumNameEnus` text NULL, `albumNameZhtw` text NULL, `albumNameKokr` text NULL, `albumNameTrtr` text NULL, `albumNamePtpt` text NULL, `albumNameJpjp` text NULL, `albumNameArar` text NULL, `soundAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `previewSoundAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `seqHardAssetguid` varchar(50) NULL COMMENT 'game asset guid', `seqNormalAssetguid` varchar(50) NULL COMMENT 'game asset guid', `seqEasyAssetguid` varchar(50) NULL COMMENT 'game asset guid', `imageAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `albumAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', INDEX `IDX_8c229c9b431aab2763c74ea3ae` (`localeNameEnus`), INDEX `IDX_56eade87e353beb0b4f8455cc6` (`localeDisplayGroupNameEnus`), INDEX `IDX_d1f1f9ebadc61c9d89320d6b43` (`albumNameEnus`), PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
    await queryRunner.query(
      "CREATE TABLE `gamedata_prism` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `serverDataUse` tinyint NOT NULL, `prismLocaleZhcn` text NULL, `prismLocaleEses` text NULL, `prismLocaleIdid` text NULL, `prismLocaleEnus` text NULL, `prismLocaleZhtw` text NULL, `prismLocaleKokr` text NULL, `prismLocaleTrtr` text NULL, `prismLocalePtpt` text NULL, `prismLocaleJpjp` text NULL, `prismLocaleArar` text NULL, `prismImageLargeAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `prismImageSmallAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', INDEX `IDX_8710f5fe3b7728b4da0f8e160b` (`prismLocaleEnus`), PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
    await queryRunner.query(
      "CREATE TABLE `gamedata_theme` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `analyticsData` varchar(255) NOT NULL, `themePercentage` int NOT NULL, `selectRate` float NOT NULL, `orderIndex` int NOT NULL, `limitedType` int NOT NULL, `rehearsalTheme` tinyint NOT NULL, `themeTypeCode` int NOT NULL, `cardbookMarkCode` text NULL, `nameImageSmallAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `nameImageLargeAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', `localeNameZhcn` text NULL, `localeNameEses` text NULL, `localeNameIdid` text NULL, `localeNameEnus` text NULL, `localeNameZhtw` text NULL, `localeNameKokr` text NULL, `localeNameTrtr` text NULL, `localeNamePtpt` text NULL, `localeNameJpjp` text NULL, `localeNameArar` text NULL, INDEX `IDX_eab6692ceb8e0e3f0e937eba09` (`localeNameEnus`), PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
    await queryRunner.query(
      "CREATE TABLE `gamedata_themetype` (`code` int UNSIGNED NOT NULL, `gameGuid` varchar(50) NOT NULL, `versionFirst` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionLast` int UNSIGNED NOT NULL COMMENT 'first version this entity appeared in', `versionSource` int UNSIGNED NOT NULL COMMENT 'current version this entity appeared in', `dateUpdated` datetime NOT NULL, `animationTime` int NOT NULL, `animationCount` int NOT NULL, `backgroundAnimation` longtext NOT NULL, `themePosition` longtext NOT NULL, `emblemPosition` longtext NOT NULL, `namePosition` longtext NOT NULL, `gradeC` longtext NOT NULL, `gradeB` longtext NOT NULL, `gradeA` longtext NOT NULL, `gradeS` longtext NOT NULL, `gradeR` longtext NOT NULL, `backgroundImageAssetguid` varchar(50) NOT NULL COMMENT 'game asset guid', PRIMARY KEY (`code`, `gameGuid`)) ENGINE=Aria",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `gamedata_themetype`');
    await queryRunner.query(
      'DROP INDEX `IDX_eab6692ceb8e0e3f0e937eba09` ON `gamedata_theme`',
    );
    await queryRunner.query('DROP TABLE `gamedata_theme`');
    await queryRunner.query(
      'DROP INDEX `IDX_8710f5fe3b7728b4da0f8e160b` ON `gamedata_prism`',
    );
    await queryRunner.query('DROP TABLE `gamedata_prism`');
    await queryRunner.query(
      'DROP INDEX `IDX_d1f1f9ebadc61c9d89320d6b43` ON `gamedata_music`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_56eade87e353beb0b4f8455cc6` ON `gamedata_music`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8c229c9b431aab2763c74ea3ae` ON `gamedata_music`',
    );
    await queryRunner.query('DROP TABLE `gamedata_music`');
    await queryRunner.query(
      'DROP INDEX `IDX_7ba8e56d7f4539fc3c0c8dce24` ON `gamedata_group`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_0dc7a9c1e87b32151614c7a7a8` ON `gamedata_group`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_eaf7cb3a81295929b1865bdc32` ON `gamedata_group`',
    );
    await queryRunner.query('DROP TABLE `gamedata_group`');
    await queryRunner.query('DROP TABLE `gamedata_card`');
    await queryRunner.query(
      'DROP INDEX `IDX_2d3c8a1ee28bd4278c40c96bfd` ON `gamedata_artist`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8f9d20f3a644c29d0503f732ed` ON `gamedata_artist`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_78466e5075bd4c5518c4a06239` ON `gamedata_artist`',
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8fa41d33254d1da36c8d605b97` ON `gamedata_artist`',
    );
    await queryRunner.query('DROP TABLE `gamedata_artist`');
  }
}
