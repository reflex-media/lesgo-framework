import crypto from 'crypto';
import cryptoConfig from 'config/crypto'; // eslint-disable-line import/no-unresolved
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';

const { algorithm, secretKey, ivLength } = cryptoConfig;

export default text => {
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
