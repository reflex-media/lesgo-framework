import { getSecretValue } from '../../secretsmanager';
import getSecretValueService from '../../../services/SecretsManagerService/getSecretValue';
import { LesgoException } from '../../../exceptions';

jest.mock('../../../services/SecretsManagerService/getSecretValue');

describe('getSecretValue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the secret value', async () => {
    const secretId = 'my-secret-id';
    const opts = {};
    const clientOpts = {};
    const secretValue = 'my-secret-value';

    (getSecretValueService as jest.Mock).mockResolvedValueOnce({
      SecretString: secretValue,
    });

    const result = await getSecretValue(secretId, opts, clientOpts);

    expect(getSecretValueService).toHaveBeenCalledWith(
      secretId,
      opts,
      clientOpts
    );
    expect(result).toBe(secretValue);
  });

  it('should return the parsed secret value if it is an object', async () => {
    const secretId = 'my-secret-id';
    const secretValue = { key: 'value' };

    (getSecretValueService as jest.Mock).mockResolvedValueOnce({
      SecretString: JSON.stringify(secretValue),
    });

    const result = await getSecretValue(secretId);

    expect(result).toEqual(secretValue);
  });

  it('should throw exception if service fails', async () => {
    const secretId = 'my-secret-id';

    (getSecretValueService as jest.Mock).mockRejectedValueOnce(
      new Error('Mock error message')
    );

    await expect(getSecretValue(secretId)).rejects.toThrow(
      new LesgoException('Failed to get secret value')
    );
  });

  it('should throw exception if returned value is empty', async () => {
    const secretId = 'my-secret-id';
    const secretValue = '';

    (getSecretValueService as jest.Mock).mockResolvedValueOnce({
      SecretString: secretValue,
    });

    await expect(getSecretValue(secretId)).rejects.toThrow(
      new LesgoException('Missing secretString')
    );
  });
});
