import crypto from 'crypto';
import cryptoConfig from 'config/crypto'; // eslint-disable-line import/no-unresolved
import LesgoException from '../exceptions/LesgoException';
import isEmpty from './isEmpty';

const { algorithm, secretKey } = cryptoConfig;
const ivLength = 16;

export const encrypt = text => {
  if (isEmpty(text)) {
    throw new LesgoException(
      'Empty parameter supplied on encrypt',
      'CRYPTO_ENCRYPT_EMPTY_PARAMETER'
    );
  }

  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = text => {
  if (isEmpty(text)) {
    throw new LesgoException(
      'Empty parameter supplied on decryp',
      'CRYPTO_DECRYPT_EMPTY_PARAMETER'
    );
  }

  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export const hash = data => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hash',
      'CRYPTO_HASH_EMPTY_PARAMETER'
    );
  }

  const hashedValue = crypto
    .createHash('sha256', 'utf8')
    .update(data)
    .digest('hex');

  return hashedValue;
};

export const hashMD5 = data => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hashMD5',
      'CRYPTO_HASHMD5_EMPTY_PARAMETER'
    );
  }

  const hashedValue = crypto.createHash('md5').update(data).digest('hex');
  return hashedValue;
};

export default { encrypt, decrypt, hash, hashMD5 };
