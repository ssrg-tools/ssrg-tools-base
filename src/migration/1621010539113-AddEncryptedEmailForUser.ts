import { MigrationInterface, QueryRunner } from 'typeorm';
import sodium from 'libsodium-wrappers';

export class AddEncryptedEmailForUser1621010539113
  implements MigrationInterface {
  name = 'AddEncryptedEmailForUser1621010539113';

  // add key here
  readonly key = Buffer.from('feedcafebabe', 'hex');

  public async up(queryRunner: QueryRunner): Promise<void> {
    await sodium.ready;
    if (this.key.length !== sodium.crypto_secretbox_KEYBYTES) {
      throw new Error(`wrong key length - did you set a key?`);
    }

    await queryRunner.query(
      'ALTER TABLE `users` ADD `encryptedEmailEncryptedvalue` tinyblob NULL AFTER `email`, ADD `encryptedEmailNonce` tinyblob NULL AFTER `encryptedEmailEncryptedvalue`',
    );

    const users = await queryRunner.query('SELECT * FROM `users`');
    for (const user of users) {
      if (!user.email) {
        continue;
      }
      const nonce = Buffer.from(
        sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES),
      );
      const encryptedValue = Buffer.from(
        sodium.crypto_secretbox_easy(user.email, nonce, this.key),
      );
      await queryRunner.query(
        `UPDATE users SET encryptedEmailEncryptedvalue = UNHEX(?), encryptedEmailNonce = UNHEX(?)
        WHERE users.id = ?`,
        [encryptedValue.toString('hex'), nonce.toString('hex'), user.id],
      );
    }

    await queryRunner.query(
      `ALTER TABLE \`users\`
        CHANGE \`encryptedEmailEncryptedvalue\` \`emailEncryptedvalue\` tinyblob NOT NULL,
        CHANGE \`encryptedEmailNonce\` \`emailNonce\` tinyblob NOT NULL,
        DROP COLUMN \`email\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`email\` VARCHAR(255) NOT NULL AFTER \`last_login\``,
    );

    const users2 = await queryRunner.query('SELECT * FROM `users`');
    for (const u of users2) {
      await queryRunner.query(`UPDATE users SET email = ? WHERE users.id = ?`, [
        Buffer.from(
          sodium.crypto_secretbox_open_easy(
            u.emailEncryptedvalue,
            u.emailNonce,
            this.key,
          ),
        ).toString(),
        u.id,
      ]);
    }

    await queryRunner.query(
      'ALTER TABLE `users` DROP COLUMN `emailEncryptedvalue`, DROP COLUMN `emailNonce`',
    );
  }
}
