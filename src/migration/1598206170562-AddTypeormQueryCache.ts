import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeormQueryCache1598206170562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `superstar_log`.`query-result-cache` (`id` int NOT NULL AUTO_INCREMENT, `identifier` varchar(255) NULL, `time` bigint NOT NULL, `duration` int NOT NULL, `query` text NOT NULL, `result` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `superstar_log`.`query-result-cache`;');
  }
}
