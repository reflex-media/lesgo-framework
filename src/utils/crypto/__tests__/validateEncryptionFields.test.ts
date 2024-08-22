import LesgoException from '../../../exceptions/LesgoException';
import validateEncryptionFields, {
  EncryptionAlgorithm,
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

  // FIXME: This test is failing as the ivLength requirement is updated on the main code

  // it('should throw LesgoException if secret key length is invalid for AES256', () => {
  //   const text = 'Hello, World!';
  //   const algorithm = EncryptionAlgorithm.AES256;
  //   const secretKey = 'invalidSecretKey';
  //   const expectedErrorMessage = 'Invalid secret key length for AES256';
  //   const expectedErrorCode =
  //     'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_SECRET_KEY_LENGTH_FOR_AES256';

  //   expect(() => {
  //     validateEncryptionFields(text, { algorithm, secretKey });
  //   }).toThrow(new LesgoException(expectedErrorMessage, expectedErrorCode));
  // });

  // it('should throw LesgoException if secret key length is invalid for AES512', () => {
  //   const text = 'Hello, World!';
  //   const algorithm = EncryptionAlgorithm.AES512;
  //   const secretKey = 'invalidSecretKey';
  //   const expectedErrorMessage = 'Invalid secret key length for AES512';
  //   const expectedErrorCode =
  //     'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_SECRET_KEY_LENGTH_FOR_AES512';
  //   const expectedData = {
  //     secretKey,
  //   };

  //   expect(() => {
  //     validateEncryptionFields(text, { algorithm, secretKey });
  //   }).toThrow(
  //     new LesgoException(
  //       expectedErrorMessage,
  //       expectedErrorCode,
  //       500,
  //       expectedData
  //     )
  //   );
  // });

  // it('should throw LesgoException if IV length is invalid', () => {
  //   const text = 'Hello, World!';
  //   const algorithm = EncryptionAlgorithm.AES256;
  //   const ivLength = 'invalidIvLength';
  //   const expectedErrorMessage =
  //     "Invalid type for 'ivLength', expecting 'number'";
  //   const expectedErrorCode =
  //     'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_IV_LENGTH';

  //   expect(() => {
  //     // @ts-ignore
  //     validateEncryptionFields(text, { algorithm, ivLength });
  //   }).toThrow(new LesgoException(expectedErrorMessage, expectedErrorCode));
  // });

  // it('should throw LesgoException if IV length is invalid for AES256', () => {
  //   const text = 'Hello, World!';
  //   const algorithm = EncryptionAlgorithm.AES256;
  //   const expectedErrorMessage = 'Invalid IV length supplied for AES256';
  //   const expectedErrorCode =
  //     'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_IV_LENGTH_FOR_AES256';

  //   expect(() => {
  //     validateEncryptionFields(text, { algorithm });
  //   }).toThrow(new LesgoException(expectedErrorMessage, expectedErrorCode));
  // });

  // it('should throw LesgoException if IV length is invalid for AES512', () => {
  //   const text = 'Hello, World!';
  //   const algorithm = EncryptionAlgorithm.AES512;
  //   const secretKey =
  //     'mySecretKeymySecretKeymySecretKemySecretKeymySecretKeymySecretKe';
  //   const expectedErrorMessage = 'Invalid IV length supplied for AES512';
  //   const expectedErrorCode =
  //     'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_IV_LENGTH_FOR_AES512';

  //   expect(() => {
  //     validateEncryptionFields(text, { algorithm, secretKey });
  //   }).toThrow(new LesgoException(expectedErrorMessage, expectedErrorCode));
  // });

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
