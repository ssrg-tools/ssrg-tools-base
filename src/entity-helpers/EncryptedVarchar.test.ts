import { EncryptedVarchar } from './EncryptedVarchar.embed';
import sodium from 'libsodium-wrappers';

describe('EncryptedVarchar', () => {
  it('basic test', async () => {
    await sodium.ready;
    const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    const obj = new EncryptedVarchar();
    expect(obj.encryptedValue).toBeUndefined();
    expect(obj.nonce).toBeUndefined();
    obj.saveValue(sodium, key, 'foo');
    expect(obj.getValue(sodium, key).toString()).toBe('foo');
  });
});
