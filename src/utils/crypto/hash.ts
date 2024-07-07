import { createHash } from 'crypto';
import cryptoConfig from '../../config/crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';

const FILE = 'lesgo.utils.crypto.hash';

export enum HashAlgorithm {
  MD5 = 'md5',
  SHA256 = 'sha256',
  SHA512 = 'sha512',
}

const hash = (
  data: string,
  { algorithm = HashAlgorithm.SHA256 }: { algorithm?: HashAlgorithm } = {}
): string => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hash',
      `${FILE}::ERROR_EMPTY_STRING_TO_HASH`
    );
  }

  let algorithmSupplied: HashAlgorithm = algorithm;
  if (isEmpty(algorithm)) {
    algorithmSupplied = cryptoConfig.hash.algorithm as HashAlgorithm;
  }

  if (!Object.values(HashAlgorithm).includes(algorithmSupplied)) {
    throw new LesgoException(
      'Invalid hash algorithm supplied',
      `${FILE}::ERROR_INVALID_HASH_ALGORITHM`,
      500,
      {
        algorithmSupplied,
        allowedAlgorithms: Object.values(HashAlgorithm),
      }
    );
  }

  const hashedValue: string = createHash(algorithmSupplied)
    .update(data)
    .digest('hex');

  return hashedValue;
};

export default hash;
