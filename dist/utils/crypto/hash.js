import { createHash } from 'crypto';
import { crypto as cryptoConfig } from '../../config';
import validateFields from '../validateFields';
import { LesgoException } from '../../exceptions';
const FILE = 'lesgo.utils.crypto.hash';
const isHashAlgorithm = algorithm => {
  return ['md5', 'sha256', 'sha512'].includes(algorithm);
};
/**
 * Calculates the hash value of the given data using the specified algorithm.
 *
 * @param data - The data to be hashed.
 * @param opts - Optional configuration for the hash algorithm.
 * @returns The hashed value as a string.
 *
 * @throws {LesgoException} if an invalid hash algorithm is supplied.
 * @throws {LesgoException} if the data is not a string.
 * @throws {LesgoException} if the data is not provided.
 * @throws {LesgoException} if the algorithm is not provided.
 * @throws {LesgoException} if the algorithm is not valid.
 * @throws {LesgoException} if the algorithm is not a string.
 * @throws {LesgoException} if the algorithm is not a valid hash algorithm.
 *
 * @example
 * ```typescript
 * import { hash } from 'lesgo/utils/crypto';
 *
 * const data = 'myData';
 *
 * const hashedValue = hash(data);
 * console.log(hashedValue); // Hashed value
 * ```
 */
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
