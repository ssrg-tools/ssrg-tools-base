import { Column, ChildEntity } from 'typeorm';
import { File } from './File';

@ChildEntity()
export class EncryptedBlob extends File {
  @Column('varbinary')
  header: Buffer;
}
