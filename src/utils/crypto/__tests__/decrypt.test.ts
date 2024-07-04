import LesgoException from '../../../exceptions/LesgoException';
import encrypt from '../encrypt';
import decrypt from '../decrypt';
import crypto from '../../crypto';

jest.mock('../../../exceptions/LesgoException');

describe('decrypt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = 'Empty parameter supplied on decryp';
    const expectedErrorCode = 'CRYPTO_DECRYPT_EMPTY_PARAMETER';

    expect(() => {
      decrypt(text);
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode
    );
  });

  it('should decrypt the text and return the decrypted value', () => {
    const text = 'plain text';

    const encrypted = encrypt(text);
    const result = decrypt(encrypted);

    expect(text).toBe(result);
  });

  it('should decrypt the text and return the decrypted value from crypto', () => {
    const text = 'plain text';

    const encrypted = encrypt(text);
    const result = crypto.decrypt(encrypted);

    expect(text).toBe(result);
  });
});
