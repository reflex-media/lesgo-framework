import { getClient } from '../../secretsmanager';
import getClientService from '../../../services/SecretsManagerService/getClient';

jest.mock('../../../services/SecretsManagerService/getClient');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClientService with the provided client options', () => {
    const clientOpts = { region: 'us-west-2', singletonConn: 'default' };

    getClient(clientOpts);

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith(clientOpts);
  });

  it('should call getClientService without any client options', () => {
    getClient();

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith(undefined);
  });
});
