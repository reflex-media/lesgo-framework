import { LesgoException } from '../../exceptions';
import cryptoConfig from '../../config/crypto';
import validateFields from '../validateFields';

export enum EncryptionAlgorithm {
  AES256 = 'aes-256-cbc',
  AES512 = 'aes-512-cbc',
}

interface ValidateEncryptionFieldsOptions {
  algorithm?: EncryptionAlgorithm;
  secretKey?: string;
  ivLength?: number;
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

export const validateIvLength = (
  ivLength?: number,
  algorithm?: EncryptionAlgorithm
) => {
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
  const ivLengthSupplied = opts?.ivLength || cryptoConfig.encryption.ivLength;

  validateEncryptionAlgorithm(algorithmSupplied);
  validateSecretKey(secretKeySupplied, algorithmSupplied);
  validateIvLength(ivLengthSupplied, algorithmSupplied);

  return {
    validText: input.text,
    validAlgorithm: algorithmSupplied,
    validSecretKey: secretKeySupplied as string,
    validIvLength: ivLengthSupplied,
  };
};

export default validateEncryptionFields;
