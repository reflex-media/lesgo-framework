import LesgoException from '../../../exceptions/LesgoException';
import validateEncryptionFields, {
  EncryptionAlgorithm,
} from '../validateEncryptionFields';

jest.mock('../../../exceptions/LesgoException');

describe('validateEncryptionFields', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = 'Empty string supplied to encrypt';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_EMPTY_STRING_TO_ENCRYPT';

    expect(() => {
      validateEncryptionFields(text);
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode
    );
  });

  //   it('should throw LesgoException if algorithm is missing', () => {
  //     const text = 'Hello, World!';
  //     const algorithm = undefined;
  //     const expectedErrorMessage = 'Missing algorithm supplied on encrypt';
  //     const expectedErrorCode =
  //       'lesgo.utils.crypto.validateEncryptionFields::ERROR_MISSING_ALGORITHM';

  //     expect(() => {
  //       validateEncryptionFields(text, { algorithm });
  //     }).toThrow(LesgoException);
  //     expect(LesgoException).toHaveBeenCalledWith(
  //       expectedErrorMessage,
  //       expectedErrorCode
  //     );
  //   });

  it('should throw LesgoException if algorithm is invalid', () => {
    const text = 'Hello, World!';
    const algorithm = 'invalidAlgorithm';
    const expectedErrorMessage = 'Invalid encryption algorithm supplied';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_ENCRYPTION_ALGORITHM';
    const expectedData = {
      algorithm,
      allowedAlgorithms: Object.values(EncryptionAlgorithm),
    };

    expect(() => {
      // @ts-ignore
      validateEncryptionFields(text, { algorithm });
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode,
      500,
      expectedData
    );
  });

  //   it('should throw LesgoException if secret key is missing', () => {
  //     const text = 'Hello, World!';
  //     const algorithm = EncryptionAlgorithm.AES256;
  //     const secretKey = undefined;
  //     const expectedErrorMessage = 'Missing secret key on encrypt';
  //     const expectedErrorCode =
  //       'lesgo.utils.crypto.validateEncryptionFields::ERROR_MISSING_SECRET_KEY';

  //     expect(() => {
  //       validateEncryptionFields(text, { algorithm, secretKey });
  //     }).toThrow(LesgoException);
  //     expect(LesgoException).toHaveBeenCalledWith(
  //       expectedErrorMessage,
  //       expectedErrorCode
  //     );
  //   });

  it('should throw LesgoException if secret key length is invalid for AES256', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const secretKey = 'invalidSecretKey';
    const expectedErrorMessage = 'Invalid secret key length for AES256';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_SECRET_KEY_LENGTH_FOR_AES256';
    const expectedData = {
      secretKey,
    };

    expect(() => {
      validateEncryptionFields(text, { algorithm, secretKey });
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode,
      500,
      expectedData
    );
  });

  it('should throw LesgoException if secret key length is invalid for AES512', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES512;
    const secretKey = 'invalidSecretKey';
    const expectedErrorMessage = 'Invalid secret key length for AES512';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_SECRET_KEY_LENGTH_FOR_AES512';
    const expectedData = {
      secretKey,
    };

    expect(() => {
      validateEncryptionFields(text, { algorithm, secretKey });
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode,
      500,
      expectedData
    );
  });

  //   it('should throw LesgoException if IV length is missing', () => {
  //     const text = 'Hello, World!';
  //     const algorithm = EncryptionAlgorithm.AES256;
  //     const ivLength = undefined;
  //     const expectedErrorMessage = 'Missing IV length supplied on encrypt';
  //     const expectedErrorCode =
  //       'lesgo.utils.crypto.validateEncryptionFields::ERROR_MISSING_IV_LENGTH';

  //     expect(() => {
  //       validateEncryptionFields(text, { algorithm, ivLength });
  //     }).toThrow(LesgoException);
  //     expect(LesgoException).toHaveBeenCalledWith(
  //       expectedErrorMessage,
  //       expectedErrorCode
  //     );
  //   });

  it('should throw LesgoException if IV length is invalid', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const ivLength = 'invalidIvLength';
    const expectedErrorMessage = 'Invalid IV length supplied on encrypt';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_IV_LENGTH';
    const expectedData = {
      ivLength,
    };

    expect(() => {
      // @ts-ignore
      validateEncryptionFields(text, { algorithm, ivLength });
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode,
      500,
      expectedData
    );
  });

  it('should throw LesgoException if IV length is invalid for AES256', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const ivLength = 32;
    const expectedErrorMessage = 'Invalid IV length supplied for AES256';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_IV_LENGTH_FOR_AES256';
    const expectedData = {
      ivLength,
    };

    expect(() => {
      validateEncryptionFields(text, { algorithm, ivLength });
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode,
      500,
      expectedData
    );
  });

  it('should throw LesgoException if IV length is invalid for AES512', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES512;
    const secretKey =
      'mySecretKeymySecretKeymySecretKemySecretKeymySecretKeymySecretKe';
    const ivLength = 16;
    const expectedErrorMessage = 'Invalid IV length supplied for AES512';
    const expectedErrorCode =
      'lesgo.utils.crypto.validateEncryptionFields::ERROR_INVALID_IV_LENGTH_FOR_AES512';
    const expectedData = {
      ivLength,
    };

    expect(() => {
      validateEncryptionFields(text, { algorithm, secretKey, ivLength });
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode,
      500,
      expectedData
    );
  });

  it('should return valid encryption fields', () => {
    const text = 'Hello, World!';
    const algorithm = EncryptionAlgorithm.AES256;
    const secretKey = 'mySecretKeymySecretKeymySecretKe';
    const ivLength = 16;

    const result = validateEncryptionFields(text, {
      algorithm,
      secretKey,
      ivLength,
    });

    expect(result.validText).toBe(text);
    expect(result.validAlgorithm).toBe(algorithm);
    expect(result.validSecretKey).toBe(secretKey);
    expect(result.validIvLength).toBe(ivLength);
  });
});
