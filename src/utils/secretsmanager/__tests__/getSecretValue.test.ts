import getSecretValue from '../../../utils/secretsmanager/getSecretValue';
import secretsmanager from '../../../utils/secretsmanager';
import getSecretValueService from '../../../services/SecretsManagerService/getSecretValue';

jest.mock('../../../services/SecretsManagerService/getSecretValue');

describe('getSecretValue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the secret value', async () => {
    const secretId = 'my-secret-id';
    const opts = {
      /* input options */
    };
    const clientOpts = {
      /* client options */
    };
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
    const opts = {
      /* input options */
    };
    const clientOpts = {
      /* client options */
    };
    const secretValue = { key: 'value' };

    (getSecretValueService as jest.Mock).mockResolvedValueOnce({
      SecretString: JSON.stringify(secretValue),
    });

    const result = await getSecretValue(secretId, opts, clientOpts);

    expect(getSecretValueService).toHaveBeenCalledWith(
      secretId,
      opts,
      clientOpts
    );
    expect(result).toEqual(secretValue);
  });

  it('should return the secret value if parsing fails', async () => {
    const secretId = 'my-secret-id';
    const opts = {
      /* input options */
    };
    const clientOpts = {
      /* client options */
    };
    const secretValue = 'invalid-json';

    (getSecretValueService as jest.Mock).mockResolvedValueOnce({
      SecretString: secretValue,
    });

    const result = await secretsmanager.getSecretValue(
      secretId,
      opts,
      clientOpts
    );

    expect(getSecretValueService).toHaveBeenCalledWith(
      secretId,
      opts,
      clientOpts
    );
    expect(result).toBe(secretValue);
  });
});
