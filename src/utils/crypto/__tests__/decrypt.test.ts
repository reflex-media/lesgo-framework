import LesgoException from '../../../exceptions/LesgoException';
import { encrypt, decrypt } from '../../crypto';

describe('decrypt', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if text is empty', () => {
    const text = '';
    const expectedErrorMessage = "Missing required 'text'";
    const expectedErrorCode =
      'lesgo.utils.validateFields::MISSING_REQUIRED_TEXT';

    expect(() => {
      decrypt(text);
    }).toThrow(
      new LesgoException(expectedErrorMessage, expectedErrorCode, 500, {
        field: { key: 'text', required: true, type: 'string' },
      })
    );
  });

  it('should decrypt the text and return the decrypted value', () => {
    const text = 'plain text';
    const encrypted = encrypt(text);
    const result = decrypt(encrypted);

    expect(text).toBe(result);
  });
});
