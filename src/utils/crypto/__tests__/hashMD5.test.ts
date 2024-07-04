import LesgoException from '../../../exceptions/LesgoException';
import hashMD5 from '../hashMD5';
import crypto from '../../crypto';

jest.mock('../../../exceptions/LesgoException');

describe('hashMD5', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if data is empty', () => {
    const data = '';
    const expectedErrorMessage = 'Empty parameter supplied on hashMD5';
    const expectedErrorCode = 'CRYPTO_HASHMD5_EMPTY_PARAMETER';

    expect(() => {
      hashMD5(data);
    }).toThrow(LesgoException);
    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode
    );
  });

  it('should return the hashed value', () => {
    const data = 'data';
    const expectedHashedValue = '8d777f385d3dfec8815d20f7496026dc';

    const result = hashMD5(data);

    expect(result).toBe(expectedHashedValue);
  });

  it('should return the hashed value', () => {
    const data = 'data';
    const expectedHashedValue = '8d777f385d3dfec8815d20f7496026dc';

    const result = crypto.hashMD5(data);

    expect(result).toBe(expectedHashedValue);
  });
});
