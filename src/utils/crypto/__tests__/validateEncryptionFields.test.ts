import LesgoException from '../../../exceptions/LesgoException';
import validateEncryptionFields, {
  EncryptionAlgorithm,
  validateSecretKey,
} from '../validateEncryptionFields';

describe('validateEncryptionFields', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = "Missing required 'text'";
    const expectedErrorCode =
      'lesgo.utils.validateFields::MISSING_REQUIRED_TEXT';

    expect(() => {
      validateEncryptionFields(text);
    }).toThrow(new LesgoException(expectedErrorMessage, expectedErrorCode));
  });

  it('should throw LesgoException if algorithm is invalid', () => {
    const text = 'Hello, World!';
    const algorithm = 'invalidAlgorithm';
    const expectedErrorMessage = 'Invalid encryption algorithm supplied';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_ENCRYPTION_ALGORITHM';

    expect(() => {
      // @ts-ignore
      validateEncryptionFields(text, { algorithm });
    }).toThrow(new LesgoException(expectedErrorMessage, expectedErrorCode));
  });

  it('should throw LesgoException if keylength is invalid', () => {
    const text = 'Hello, World!';
    const algorithm = 'invalidAlgorithm';
    const expectedErrorMessage =
      'Invalid secret key length for invalidAlgorithm';

    expect(() => {
      // @ts-ignore
      validateSecretKey(text, algorithm);
    }).toThrow(new LesgoException(expectedErrorMessage));
  });

  it('should return valid encryption fields', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const secretKey = 'mySecretKeymySecretKeymySecretKe';

    const result = validateEncryptionFields(text, {
      algorithm,
      secretKey,
    });

    expect(result.validText).toBe(text);
    expect(result.validAlgorithm).toBe(algorithm);
    expect(result.validSecretKey).toBe(secretKey);
  });
});
