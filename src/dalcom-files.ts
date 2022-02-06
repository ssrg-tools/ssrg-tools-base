import { Buffer } from 'buffer';

export const gnpSignature = Buffer.from(
  ['\x89', '\x50', '\x4e', '\x47', '\x0d', '\x0a', '\x1a', '\x0a'].reverse().join(''),
  'binary',
);
export const mp4SignatureFirstBlockId = 'ftyp';
export const mp4SignatureBlockTypes = [
  'avc1',
  'iso2',
  'isom',
  'mmp4',
  'mp41',
  'mp42',
  'mp71',
  'msnv',
  'ndas',
  'ndsc',
  'ndsh',
  'ndsm',
  'ndsp',
  'ndss',
  'ndxc',
  'ndxh',
  'ndxm',
  'ndxp',
  'ndxs',
];
export const mp4Signatures = mp4SignatureBlockTypes.map(subtype =>
  Buffer.from([...(mp4SignatureFirstBlockId + subtype)].reverse().join('')),
);
export const vkmSignature = Buffer.from(['\x1A', '\x45', '\xDF', '\xA3'].reverse().join(''), 'binary');
export const ggoSignature = Buffer.from(
  ['\x4F', '\x67', '\x67', '\x53', '\x00', '\x02', '\x00', '\x00'].reverse().join(''),
  'binary',
);
export const vawSignature = Buffer.from([...'RIFF'].reverse().join(''));

export function isReversedFile(input: Buffer): string | false {
  const checks = [
    () => signatureCheck('reversed-png', input.slice(-gnpSignature.length), [gnpSignature]),
    () => signatureCheck('reversed-mp4', input.slice(-12, -4), mp4Signatures),
    () => signatureCheck('reversed-mkv', input.slice(-vkmSignature.length), [vkmSignature]),
    () => signatureCheck('reversed-ogg', input.slice(-ggoSignature.length), [ggoSignature]),
    () => signatureCheck('reversed-wav', input.slice(-vawSignature.length), [vawSignature]),
  ];

  for (const check of checks) {
    const result = check();
    if (result) {
      return result;
    }
  }

  return false;
}

function signatureCheck(id: string, frame: Buffer, signatures: Buffer[]) {
  return signatures.some(signature => frame.compare(signature) === 0) ? id : false;
}

export function reverseBuffer(input: Buffer) {
  const length = input.length;
  const output = Buffer.allocUnsafe(length);

  for (let index = 0; index < length; index++) {
    output.writeUInt8(input.readUInt8(index), length - index - 1);
  }

  return output;
}
