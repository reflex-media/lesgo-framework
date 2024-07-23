import { LesgoException } from '../../exceptions';
import cryptoConfig from '../../config/crypto';
import validateFields from '../validateFields';
export var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
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
  const input = validateFields({ secretKey, algorithm }, [
    { key: 'algorithm', type: 'string', required: true },
    { key: 'secretKey', type: 'string', required: true },
  ]);
  if (
    input.algorithm === EncryptionAlgorithm.AES256 &&
    input.secretKey.length !== 32
  ) {
    throw new LesgoException(
      'Invalid secret key length for AES256',
      `${FILE}::ERROR_INVALID_SECRET_KEY_LENGTH_FOR_AES256`,
      500,
      {
        secretKey,
      }
    );
  }
  if (
    input.algorithm === EncryptionAlgorithm.AES512 &&
    input.secretKey.length !== 64
  ) {
    throw new LesgoException(
      'Invalid secret key length for AES512',
      `${FILE}::ERROR_INVALID_SECRET_KEY_LENGTH_FOR_AES512`,
      500,
      {
        secretKey,
      }
    );
  }
};
export const validateIvLength = (ivLength, algorithm) => {
  const input = validateFields({ ivLength, algorithm }, [
    { key: 'ivLength', type: 'number', required: true },
    { key: 'algorithm', type: 'string', required: true },
  ]);
  if (input.ivLength !== 16 && input.algorithm === EncryptionAlgorithm.AES256) {
    throw new LesgoException(
      'Invalid IV length supplied for AES256',
      `${FILE}::ERROR_INVALID_IV_LENGTH_FOR_AES256`,
      500,
      {
        ivLength,
      }
    );
  }
  if (input.ivLength !== 32 && input.algorithm === EncryptionAlgorithm.AES512) {
    throw new LesgoException(
      'Invalid IV length supplied for AES512',
      `${FILE}::ERROR_INVALID_IV_LENGTH_FOR_AES512`,
      500,
      {
        ivLength,
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
  const ivLengthSupplied =
    (opts === null || opts === void 0 ? void 0 : opts.ivLength) ||
    cryptoConfig.encryption.ivLength;
  validateEncryptionAlgorithm(algorithmSupplied);
  validateSecretKey(secretKeySupplied, algorithmSupplied);
  validateIvLength(ivLengthSupplied, algorithmSupplied);
  return {
    validText: input.text,
    validAlgorithm: algorithmSupplied,
    validSecretKey: secretKeySupplied,
    validIvLength: ivLengthSupplied,
  };
};
export default validateEncryptionFields;
