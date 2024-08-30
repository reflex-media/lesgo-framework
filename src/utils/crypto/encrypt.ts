import { randomBytes, createCipheriv } from 'crypto';
import validateEncryptionFields, {
  EncryptionAlgorithm,
} from './validateEncryptionFields';
import logger from '../logger';

const FILE = 'lesgo.utils.crypto.encrypt';

export interface EncryptOptions {
  algorithm?: EncryptionAlgorithm;
  secretKey?: string;
}

/**
 * Encrypts the given text using the specified options.
 *
 * @param text - The text to be encrypted.
 * @param opts - Optional encryption options.
 * @returns The encrypted text.
 *
 * @throws {LesgoException} If there is an error encrypting the text.
 * @throws {LesgoException} If the text is not a string.
 * @throws {LesgoException} If the algorithm is not valid.
 * @throws {LesgoException} If the secret key is not valid.
 * @throws {LesgoException} If the secret key is not provided.
 * @throws {LesgoException} If the algorithm is not provided.
 *
 * @example
 * ```typescript
 * import { encrypt } from 'lesgo/utils/crypto';
 *
 * const text = 'myText';
 *
 * const encryptedText = encrypt(text);
 * console.log(encryptedText); // Encrypted text
 * ```
 */
const encrypt = (text: string, opts?: EncryptOptions) => {
  logger.debug(`${FILE}::ENCRYPT`, { text });

  const { validText, validAlgorithm, validIvLength, validSecretKey } =
    validateEncryptionFields(text, opts);

  const iv = randomBytes(validIvLength);
  const cipher = createCipheriv(validAlgorithm, validSecretKey, iv);

  let encrypted = cipher.update(validText);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const encryptedText = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  logger.debug(`${FILE}::ENCRYPTED_TEXT`, { encryptedText });

  return encryptedText;
};

export default encrypt;
