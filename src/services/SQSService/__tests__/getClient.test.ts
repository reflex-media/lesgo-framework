import { SQSClient } from '@aws-sdk/client-sqs';
import getClient from '../getClient';
import logger from '../../../utils/logger';

jest.mock('../../../utils/logger');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new client if singleton connection is not yet created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    const client = getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.getClient::NEW_CLIENT',
      {
        client,
        region: 'us-west-2',
      }
    );
    expect(client).toBeInstanceOf(SQSClient);
  });

  it('should return the existing client if singleton connection is already created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    const client1 = getClient({ region, singletonConn });
    const client2 = getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.getClient::REUSE_CLIENT_SINGLETON',
      {
        singletonConn,
        region: 'us-west-2',
      }
    );
    expect(client2).toBe(client1);
  });

  it('should create a new client with the specified region', () => {
    const region = 'eu-central-1';
    const singletonConn = 'default-3';

    const client = getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.getClient::NEW_CLIENT',
      {
        client,
        region: 'eu-central-1',
      }
    );
    expect(client).toBeInstanceOf(SQSClient);
  });

  it('should create separate clients for different singleton connections', () => {
    const region = 'us-west-2';
    const singletonConn1 = 'connection1';
    const singletonConn2 = 'connection2';

    const client1 = getClient({ region, singletonConn: singletonConn1 });
    const client2 = getClient({ region, singletonConn: singletonConn2 });

    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.getClient::NEW_CLIENT',
      {
        client: client1,
        region: 'us-west-2',
      }
    );
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.SQSService.getClient::NEW_CLIENT',
      {
        client: client2,
        region: 'us-west-2',
      }
    );
    expect(client1).toBeInstanceOf(SQSClient);
    expect(client2).toBeInstanceOf(SQSClient);
    expect(client1).not.toBe(client2);
  });
});
