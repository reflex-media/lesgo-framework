import { createHash } from 'crypto';
import { crypto as cryptoConfig } from '../../config';
import validateFields from '../validateFields';
import { LesgoException } from '../../exceptions';

const FILE = 'lesgo.utils.crypto.hash';

export type HashAlgorithm = 'md5' | 'sha256' | 'sha512';

export interface HashOptions {
  algorithm?: HashAlgorithm;
}

const isHashAlgorithm = (algorithm: string): algorithm is HashAlgorithm => {
  return ['md5', 'sha256', 'sha512'].includes(algorithm);
};

const hash = (data: string, opts?: HashOptions): string => {
  const input = validateFields({ data }, [
    { key: 'data', type: 'string', required: true },
  ]);

  const algorithmSupplied = opts?.algorithm || cryptoConfig.hash.algorithm;

  if (!isHashAlgorithm(algorithmSupplied)) {
    throw new LesgoException(
      'Invalid hash algorithm supplied',
      `${FILE}::ERROR_INVALID_HASH_ALGORITHM`,
      500,
      {
        algorithmSupplied,
      }
    );
  }

  const hashedValue: string = createHash(algorithmSupplied)
    .update(input.data)
    .digest('hex');

  return hashedValue;
};

export default hash;
