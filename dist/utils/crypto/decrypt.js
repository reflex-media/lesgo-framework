import { createDecipheriv } from 'crypto';
import cryptoConfig from '../../config/crypto';
import {
  validateEncryptionAlgorithm,
  validateSecretKey,
} from './validateEncryptionFields';
import logger from '../logger';
import validateFields from '../validateFields';
const FILE = 'lesgo.utils.crypto.decrypt';
/**
 * Decrypts the given encrypted text.
 *
 * @param text - The encrypted text to be decrypted.
 * @param opts - Optional decryption options.
 * @returns The decrypted text.
 *
 * @throws {LesgoException} If there is an error decrypting the text.
 * @throws {LesgoException} If the text is not a string.
 * @throws {LesgoException} If the text is not encrypted.
 * @throws {LesgoException} If the algorithm is not valid.
 * @throws {LesgoException} If the secret key is not valid.
 * @throws {LesgoException} If the secret key is not provided.
 * @throws {LesgoException} If the algorithm is not provided.
 * @throws {LesgoException} If the text is not provided.
 *
 * @example
 * ```typescript
 * import { decrypt } from 'lesgo/utils/crypto';
 *
 * const encryptedText = 'encryptedText';
 *
 * const decryptedText = decrypt(encryptedText);
 * console.log(decryptedText); // Decrypted text
 * ```
 */
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
