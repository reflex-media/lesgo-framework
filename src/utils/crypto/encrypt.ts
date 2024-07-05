import { randomBytes, createCipheriv } from 'crypto';
// @ts-ignore
import cryptoConfig from 'config/crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';

const { algorithm, secretKey, ivLength } = cryptoConfig;

const encrypt = (text: string): string => {
  if (isEmpty(text)) {
    throw new LesgoException(
      'Empty parameter supplied on encrypt',
      'CRYPTO_ENCRYPT_EMPTY_PARAMETER'
    );
  }

  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, secretKey, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export default encrypt;
