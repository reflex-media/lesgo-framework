import LesgoException from '../../../exceptions/LesgoException';
import encrypt from '../encrypt';
import decrypt from '../decrypt';
import { EncryptionAlgorithm } from '../validateEncryptionFields';

describe('encrypt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = "Missing required 'text'";
    const expectedErrorCode =
      'lesgo.utils.validateFields::MISSING_REQUIRED_TEXT';

    expect(() => {
      encrypt(text);
    }).toThrow(
      new LesgoException(expectedErrorMessage, expectedErrorCode, 500, {
        field: { key: 'text', required: true, type: 'string' },
      })
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
    const result = encrypt(text);
    const decrypted = decrypt(result);

    expect(text).toBe(decrypted);
  });

  it('should encrypt the text using the specified algorithm and secret key', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const secretKey = 'mySecretKeyMySecretKeyMySecretKe';

    const result = encrypt(text, {
      algorithm,
      secretKey,
    });
    const decrypted = decrypt(result, {
      algorithm,
      secretKey,
    });

    expect(text).toBe(decrypted);
  });
});
