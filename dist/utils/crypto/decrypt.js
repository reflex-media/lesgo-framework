import { createDecipheriv } from 'crypto';
import cryptoConfig from '../../config/crypto';
import {
  validateEncryptionAlgorithm,
  validateSecretKey,
} from './validateEncryptionFields';
import logger from '../logger';
import validateFields from '../validateFields';
const FILE = 'lesgo.utils.crypto.decrypt';
const decrypt = (text, opts) => {
  logger.debug(`${FILE}::DECRYPT`, { text });
  const input = validateFields({ text }, [
    { key: 'text', type: 'string', required: true },
  ]);
  const validAlgorithm =
    (opts === null || opts === void 0 ? void 0 : opts.algorithm) ||
    cryptoConfig.encryption.algorithm;
  const validSecretKey =
    (opts === null || opts === void 0 ? void 0 : opts.secretKey) ||
    cryptoConfig.encryption.secretKey;
  validateEncryptionAlgorithm(validAlgorithm);
  validateSecretKey(validSecretKey, validAlgorithm);
  const textParts = input.text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(validAlgorithm, validSecretKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  const decryptedText = decrypted.toString();
  logger.debug(`${FILE}::DECRYPTED_TEXT`, { decryptedText });
  return decryptedText;
};
export default decrypt;
