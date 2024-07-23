import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import getClient from '../getClient';
import SecretsManagerService from '../../SecretsManagerService';

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new client if singleton connection is not yet created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    const client = getClient({ region, singletonConn });
    expect(client).toBeInstanceOf(SecretsManagerClient);
  });

  it('should return the existing client if singleton connection is already created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    const client1 = getClient({ region, singletonConn });
    const client2 = SecretsManagerService.getClient({ region, singletonConn });

    expect(client2).toBe(client1);
  });

  it('should create a new client with the specified region', () => {
    const region = 'eu-central-1';
    const singletonConn = 'default-3';

    const client = getClient({ region, singletonConn });

    expect(client).toBeInstanceOf(SecretsManagerClient);
  });

  it('should create separate clients for different singleton connections', () => {
    const region = 'us-west-2';
    const singletonConn1 = 'connection1';
    const singletonConn2 = 'connection2';

    const client1 = getClient({ region, singletonConn: singletonConn1 });
    const client2 = getClient({ region, singletonConn: singletonConn2 });

    expect(client1).toBeInstanceOf(SecretsManagerClient);
    expect(client2).toBeInstanceOf(SecretsManagerClient);
    expect(client1).not.toBe(client2);
  });
});
