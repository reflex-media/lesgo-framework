import crypto from 'crypto';
import cryptoConfig from 'Config/crypto'; // eslint-disable-line import/no-unresolved

const { algorithm, secretKey } = cryptoConfig;
const ivLength = 16;

export const encrypt = text => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = text => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const hash = data => {
  const hashedValue = crypto
    .createHash('sha256', 'utf8')
    .update(data)
    .digest('hex');

  return hashedValue;
};

export const hashMD5 = data => {
  const hashedValue = crypto
    .createHash('md5')
    .update(data)
    .digest('hex');

  return hashedValue;
};

export default { encrypt, decrypt, hash, hashMD5 };
