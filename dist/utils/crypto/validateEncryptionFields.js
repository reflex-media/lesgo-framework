import { LesgoException } from '../../exceptions';
import cryptoConfig from '../../config/crypto';
import validateFields from '../validateFields';
export var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
  EncryptionAlgorithm['AES128'] = 'aes-128-cbc';
  EncryptionAlgorithm['AES192'] = 'aes-192-cbc';
  EncryptionAlgorithm['AES256'] = 'aes-256-cbc';
  EncryptionAlgorithm['AES512'] = 'aes-512-cbc';
})(EncryptionAlgorithm || (EncryptionAlgorithm = {}));
const FILE = 'lesgo.utils.crypto.validateEncryptionFields';
export const validateEncryptionAlgorithm = algorithm => {
  const input = validateFields({ algorithm }, [
    { key: 'algorithm', type: 'string', required: true },
  ]);
  if (!Object.values(EncryptionAlgorithm).includes(input.algorithm)) {
    throw new LesgoException(
      'Invalid encryption algorithm supplied',
      `${FILE}::ERROR_INVALID_ENCRYPTION_ALGORITHM`,
      500,
      {
        algorithm,
        allowedAlgorithms: Object.values(EncryptionAlgorithm),
      }
    );
  }
};
export const validateSecretKey = (secretKey, algorithm) => {
  const keyLengths = {
    'aes-128-cbc': 16,
    'aes-192-cbc': 24,
    'aes-256-cbc': 32,
    'aes-512-cbc': 64,
  };
  const input = validateFields({ secretKey, algorithm }, [
    { key: 'algorithm', type: 'string', required: true },
    { key: 'secretKey', type: 'string', required: true },
  ]);
  const keyLength = keyLengths[input.algorithm];
  if (!keyLength) {
    throw new LesgoException(
      `Invalid secret key length for ${input.algorithm}`,
      `${FILE}::ERROR_INVALID_SECRET_KEY_LENGTH`,
      500,
      {
        secretKey,
        keyLength,
      }
    );
  }
};
const validateEncryptionFields = (text, opts) => {
  const input = validateFields({ text }, [
    { key: 'text', type: 'string', required: true },
  ]);
  const algorithmSupplied =
    (opts === null || opts === void 0 ? void 0 : opts.algorithm) ||
    cryptoConfig.encryption.algorithm;
  const secretKeySupplied =
    (opts === null || opts === void 0 ? void 0 : opts.secretKey) ||
    cryptoConfig.encryption.secretKey;
  validateEncryptionAlgorithm(algorithmSupplied);
  validateSecretKey(secretKeySupplied, algorithmSupplied);
  return {
    validText: input.text,
    validAlgorithm: algorithmSupplied,
    validSecretKey: secretKeySupplied,
    validIvLength: 16,
  };
};
export default validateEncryptionFields;
