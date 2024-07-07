import { createHash } from 'crypto';
import cryptoConfig from '../../config/crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';
const FILE = 'lesgo.utils.crypto.hash';
export var HashAlgorithm;
(function (HashAlgorithm) {
  HashAlgorithm['MD5'] = 'md5';
  HashAlgorithm['SHA256'] = 'sha256';
  HashAlgorithm['SHA512'] = 'sha512';
})(HashAlgorithm || (HashAlgorithm = {}));
const hash = (data, { algorithm = HashAlgorithm.SHA256 } = {}) => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hash',
      `${FILE}::ERROR_EMPTY_STRING_TO_HASH`
    );
  }
  let algorithmSupplied = algorithm;
  if (isEmpty(algorithm)) {
    algorithmSupplied = cryptoConfig.hash.algorithm;
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
  const hashedValue = createHash(algorithmSupplied).update(data).digest('hex');
  return hashedValue;
};
export default hash;
