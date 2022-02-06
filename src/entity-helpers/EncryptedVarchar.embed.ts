import { Buffer } from 'buffer';
import _sodium from 'libsodium-wrappers';
import { Column } from 'typeorm';

export class EncryptedVarchar {
  @Column('tinyblob')
  encryptedValue: Buffer;

  @Column('tinyblob')
  nonce: Buffer;

  saveValue(sodium: typeof _sodium, key: Uint8Array, value: string) {
    this.nonce = Buffer.from(sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES));
    this.encryptedValue = Buffer.from(sodium.crypto_secretbox_easy(value, this.nonce, key));
  }

  getValue(sodium: typeof _sodium, key: Uint8Array): Buffer {
    return Buffer.from(sodium.crypto_secretbox_open_easy(this.encryptedValue, this.nonce, key));
  }
}
