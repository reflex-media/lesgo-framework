import LesgoException from '../../../exceptions/LesgoException';
import encrypt from '../encrypt';
import decrypt from '../decrypt';
import crypto from '../../crypto';

jest.mock('../../../exceptions/LesgoException');

describe('encrypt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = 'Empty parameter supplied on encrypt';
    const expectedErrorCode = 'CRYPTO_ENCRYPT_EMPTY_PARAMETER';

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
});
