import LesgoException from '../../../exceptions/LesgoException';
import hash from '../hash';
import crypto from '../../crypto';

jest.mock('../../../exceptions/LesgoException');

describe('hash', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if data is empty', () => {
    const data = '';
    const expectedErrorMessage = 'Empty parameter supplied on hash';
    const expectedErrorCode = 'CRYPTO_HASH_EMPTY_PARAMETER';

    expect(() => {
      hash(data);
    }).toThrow(LesgoException);

    expect(LesgoException).toHaveBeenCalledWith(
      expectedErrorMessage,
      expectedErrorCode
    );
  });

  it('should return the hashed value', () => {
    const data = 'data';
    const expectedHashedValue =
      '3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7';

    const result = hash(data);

    expect(result).toBe(expectedHashedValue);
  });

  it('should return the hashed value from crypto', () => {
    const data = 'data';
    const expectedHashedValue =
      '3a6eb0790f39ac87c94f3856b2dd2c5d110e6811602261a9a923d3bb23adc8b7';

    const result = crypto.hash(data);

    expect(result).toBe(expectedHashedValue);
  });
});
