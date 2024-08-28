import { hash } from '../../crypto';
import LesgoException from '../../../exceptions/LesgoException';

describe('hash', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw LesgoException if data is empty', () => {
    const data = '';

    expect(() => {
      hash(data);
    }).toThrow(
      new LesgoException(
        "Missing required 'data'",
        'lesgo.utils.validateFields::MISSING_REQUIRED_DATA',
        500,
        { field: { key: 'data', required: true, type: 'string' } }
      )
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

    const result = hash(data);

    expect(result).toBe(expectedHashedValue);
  });

  it('should use the specified hash algorithm', () => {
    const data = 'data';
    const algorithm = 'md5';
    const expectedHashedValue = '8d777f385d3dfec8815d20f7496026dc';

    const result = hash(data, { algorithm });

    expect(result).toBe(expectedHashedValue);
  });

  it('should throw LesgoException if an invalid hash algorithm is supplied', () => {
    const data = 'data';
    const algorithm = 'invalidAlgorithm';
    const expectedErrorMessage = 'Invalid hash algorithm supplied';
    const expectedErrorCode =
      'lesgo.utils.crypto.hash::ERROR_INVALID_HASH_ALGORITHM';

    expect(() => {
      // @ts-ignore
      hash(data, { algorithm });
    }).toThrow(
      new LesgoException(expectedErrorMessage, expectedErrorCode, 500, {
        algorithm,
      })
    );
  });
});
