import { createDecipheriv } from 'crypto';
import cryptoConfig from '../../config/crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';
import {
  validateEncryptionAlgorithm,
  validateSecretKey,
} from './validateEncryptionFields';
import logger from '../logger';
const FILE = 'lesgo.utils.crypto.decrypt';
const decrypt = (text, { algorithm, secretKey } = {}) => {
  logger.debug(`${FILE}::DECRYPT`, { text });
  if (isEmpty(text)) {
    throw new LesgoException(
      'Empty string supplied to decrypt',
      `${FILE}::ERROR_EMPTY_STRING_TO_DECRYPT`
    );
  }
  const validAlgorithm = algorithm || cryptoConfig.encryption.algorithm;
  const validSecretKey = secretKey || cryptoConfig.encryption.secretKey;
  validateEncryptionAlgorithm(validAlgorithm);
  validateSecretKey(validSecretKey, validAlgorithm);
  const textParts = text.split(':');
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
