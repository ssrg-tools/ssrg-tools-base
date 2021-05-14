import { Column } from 'typeorm';
import _sodium from 'libsodium-wrappers';

export class EncryptedVarchar {
  @Column('tinyblob')
  encryptedValue: Uint8Array;

  @Column('tinyblob')
  nonce: Uint8Array;

  saveValue(sodium: typeof _sodium, key: Uint8Array, value: string) {
    this.nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    this.encryptedValue = sodium.crypto_secretbox_easy(value, this.nonce, key);
  }

  getValue(sodium: typeof _sodium, key: Uint8Array): Uint8Array {
    return sodium.crypto_secretbox_open_easy(
      this.encryptedValue,
      this.nonce,
      key,
    );
  }
}
