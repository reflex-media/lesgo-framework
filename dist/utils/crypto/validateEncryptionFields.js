import { LesgoException } from '../../exceptions';
import cryptoConfig from '../../config/crypto';
import isEmpty from '../isEmpty';
export var EncryptionAlgorithm;
(function (EncryptionAlgorithm) {
  EncryptionAlgorithm['AES256'] = 'aes-256-cbc';
  EncryptionAlgorithm['AES512'] = 'aes-512-cbc';
})(EncryptionAlgorithm || (EncryptionAlgorithm = {}));
const FILE = 'lesgo.utils.crypto.validateEncryptionFields';
export const validateEncryptionAlgorithm = algorithm => {
  if (isEmpty(algorithm)) {
    throw new LesgoException(
      'Missing algorithm supplied on encrypt',
      `${FILE}::ERROR_MISSING_ALGORITHM`
    );
  }
  if (!Object.values(EncryptionAlgorithm).includes(algorithm)) {
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
  if (isEmpty(secretKey)) {
    throw new LesgoException(
      'Missing secret key on encrypt',
      `${FILE}::ERROR_MISSING_SECRET_KEY`
    );
  }
  if (
    algorithm === EncryptionAlgorithm.AES256 &&
    (secretKey === null || secretKey === void 0 ? void 0 : secretKey.length) !==
      32
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
    algorithm === EncryptionAlgorithm.AES512 &&
    (secretKey === null || secretKey === void 0 ? void 0 : secretKey.length) !==
      64
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
  if (isEmpty(ivLength)) {
    throw new LesgoException(
      'Missing IV length supplied on encrypt',
      `${FILE}::ERROR_MISSING_IV_LENGTH`
    );
  }
  if (isNaN(ivLength)) {
    throw new LesgoException(
      'Invalid IV length supplied on encrypt',
      `${FILE}::ERROR_INVALID_IV_LENGTH`,
      500,
      {
        ivLength,
      }
    );
  }
  if (ivLength !== 16 && algorithm === EncryptionAlgorithm.AES256) {
    throw new LesgoException(
      'Invalid IV length supplied for AES256',
      `${FILE}::ERROR_INVALID_IV_LENGTH_FOR_AES256`,
      500,
      {
        ivLength,
      }
    );
  }
  if (ivLength !== 32 && algorithm === EncryptionAlgorithm.AES512) {
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
const validateEncryptionFields = (
  text,
  { algorithm, secretKey, ivLength } = {}
) => {
  if (isEmpty(text)) {
    throw new LesgoException(
      'Empty string supplied to encrypt',
      `${FILE}::ERROR_EMPTY_STRING_TO_ENCRYPT`
    );
  }
  const algorithmSupplied = algorithm || cryptoConfig.encryption.algorithm;
  const secretKeySupplied = secretKey || cryptoConfig.encryption.secretKey;
  const ivLengthSupplied = ivLength || cryptoConfig.encryption.ivLength;
  validateEncryptionAlgorithm(algorithmSupplied);
  validateSecretKey(secretKeySupplied, algorithmSupplied);
  validateIvLength(ivLengthSupplied, algorithmSupplied);
  return {
    validText: text,
    validAlgorithm: algorithmSupplied,
    validSecretKey: secretKeySupplied,
    validIvLength: ivLengthSupplied,
  };
};
export default validateEncryptionFields;
