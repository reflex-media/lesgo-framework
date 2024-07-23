import getClient from '../getClient';
import getSecretValue from '../getSecretValue';
import LesgoException from '../../../exceptions/LesgoException';

jest.mock('../getClient');

describe('getSecretValue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the provided client options', async () => {
    const secretId = 'my-secret';
    const clientOpts = { region: 'us-west-2' };
    const client = { send: jest.fn() };
    (getClient as jest.Mock).mockReturnValue(client);

    await getSecretValue(secretId, undefined, clientOpts);

    expect(getClient).toHaveBeenCalledWith(clientOpts);
  });

  it('should call GetSecretValueCommand with the correct parameters', async () => {
    const secretId = 'my-secret';
    const opts = { VersionStage: 'AWSCURRENT' };
    const client = { send: jest.fn() };
    (getClient as jest.Mock).mockReturnValue(client);

    await getSecretValue(secretId, opts);

    expect(client.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          SecretId: secretId,
          ...opts,
        },
      })
    );
  });

  it('should throw a LesgoException on error', async () => {
    const secretId = 'my-secret';
    const error = new Error('Something went wrong');
    const client = { send: jest.fn().mockRejectedValue(error) };
    (getClient as jest.Mock).mockReturnValue(client);

    await expect(getSecretValue(secretId)).rejects.toThrow(LesgoException);
  });
});
