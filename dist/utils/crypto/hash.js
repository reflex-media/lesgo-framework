import { createHash } from 'crypto';
import cryptoConfig from '../../config/crypto';
import validateFields from '../validateFields';
import { LesgoException } from '../../exceptions';
const FILE = 'lesgo.utils.crypto.hash';
const isHashAlgorithm = algorithm => {
  return ['md5', 'sha256', 'sha512'].includes(algorithm);
};
const hash = (data, opts) => {
  const input = validateFields({ data }, [
    { key: 'data', type: 'string', required: true },
  ]);
  const algorithmSupplied =
    (opts === null || opts === void 0 ? void 0 : opts.algorithm) ||
    cryptoConfig.hash.algorithm;
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
  const hashedValue = createHash(algorithmSupplied)
    .update(input.data)
    .digest('hex');
  return hashedValue;
};
export default hash;
