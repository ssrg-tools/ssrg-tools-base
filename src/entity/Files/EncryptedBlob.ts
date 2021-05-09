import { Column, ChildEntity } from 'typeorm';
import { File } from './File';

@ChildEntity()
export class EncryptedBlob extends File {
  /** store base64 encoded encryption header information */
  @Column('varchar')
  header: string;
}

export interface EncryptedBlobWithUri extends EncryptedBlob {
  uri: string;
}
