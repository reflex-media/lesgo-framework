import LesgoException from '../../../exceptions/LesgoException';
import encrypt from '../encrypt';
import decrypt from '../decrypt';
import crypto from '../../crypto';
import { EncryptionAlgorithm } from '../validateEncryptionFields';

jest.mock('../../../exceptions/LesgoException');

describe('encrypt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = 'Empty string supplied to encrypt';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_EMPTY_STRING_TO_ENCRYPT';

    expect(() => {
      encrypt(text);
    }).toThrow(LesgoException);

    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode
    );
  });

  it('should encrypt the text and return the encrypted value', () => {
    const text = 'Hello, World!';
    const result = encrypt(text);
    const decrypted = decrypt(result);

    expect(text).toBe(decrypted);
  });

  it('should encrypt the text and return the encrypted value from crypto', () => {
    const text = 'Hello, World!';
    const result = crypto.encrypt(text);
    const decrypted = decrypt(result);

    expect(text).toBe(decrypted);
  });

  it('should encrypt the text using the specified algorithm and secret key', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const secretKey = 'mySecretKeyMySecretKeyMySecretKe';
    const ivLength = 16;

    const result = encrypt(text, {
      algorithm,
      secretKey,
      ivLength,
    });
    const decrypted = decrypt(result, {
      algorithm,
      secretKey,
    });

    expect(text).toBe(decrypted);
  });
});
