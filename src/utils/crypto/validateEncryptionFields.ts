import { LesgoException } from '../../exceptions';
import cryptoConfig from '../../config/crypto';
import validateFields from '../validateFields';

export enum EncryptionAlgorithm {
  AES128 = 'aes-128-cbc',
  AES192 = 'aes-192-cbc',
  AES256 = 'aes-256-cbc',
  AES512 = 'aes-512-cbc',
}

interface ValidateEncryptionFieldsOptions {
  algorithm?: EncryptionAlgorithm;
  secretKey?: string;
}

const FILE = 'lesgo.utils.crypto.validateEncryptionFields';

export const validateEncryptionAlgorithm = (algorithm: EncryptionAlgorithm) => {
  const input = validateFields({ algorithm }, [
    { key: 'algorithm', type: 'string', required: true },
  ]);

  if (
    !Object.values(EncryptionAlgorithm).includes(
      input.algorithm as EncryptionAlgorithm
    )
  ) {
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

export const validateSecretKey = (
  secretKey?: string,
  algorithm?: EncryptionAlgorithm
) => {
  const keyLengths: { [key in EncryptionAlgorithm]: number } = {
    'aes-128-cbc': 16,
    'aes-192-cbc': 24,
    'aes-256-cbc': 32,
    'aes-512-cbc': 64,
  };

  const input = validateFields({ secretKey, algorithm }, [
    { key: 'algorithm', type: 'string', required: true },
    { key: 'secretKey', type: 'string', required: true },
  ]) as { algorithm: EncryptionAlgorithm; secretKey: string };

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

const validateEncryptionFields = (
  text: string,
  opts?: ValidateEncryptionFieldsOptions
) => {
  const input = validateFields({ text }, [
    { key: 'text', type: 'string', required: true },
  ]);

  const algorithmSupplied =
    opts?.algorithm ||
    (cryptoConfig.encryption.algorithm as EncryptionAlgorithm);
  const secretKeySupplied =
    opts?.secretKey || cryptoConfig.encryption.secretKey;

  validateEncryptionAlgorithm(algorithmSupplied);
  validateSecretKey(secretKeySupplied, algorithmSupplied);

  return {
    validText: input.text,
    validAlgorithm: algorithmSupplied,
    validSecretKey: secretKeySupplied as string,
    validIvLength: 16,
  };
};

export default validateEncryptionFields;
