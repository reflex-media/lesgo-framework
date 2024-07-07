import { randomBytes, createCipheriv } from 'crypto';
import validateEncryptionFields, {
  EncryptionAlgorithm,
} from './validateEncryptionFields';
import logger from '../logger';

const FILE = 'lesgo.utils.crypto.encrypt';

const encrypt = (
  text: string,
  {
    algorithm,
    secretKey,
    ivLength,
  }: {
    algorithm?: EncryptionAlgorithm;
    secretKey?: string;
    ivLength?: number;
  } = {}
) => {
  logger.debug(`${FILE}::ENCRYPT`, { text });

  const { validText, validAlgorithm, validIvLength, validSecretKey } =
    validateEncryptionFields(text, {
      algorithm,
      secretKey,
      ivLength,
    });

  const iv = randomBytes(validIvLength);
  const cipher = createCipheriv(validAlgorithm, validSecretKey, iv);

  let encrypted = cipher.update(validText);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const encryptedText = `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  logger.debug(`${FILE}::ENCRYPTED_TEXT`, { encryptedText });

  return encryptedText;
};

export default encrypt;
