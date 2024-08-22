import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import logger from '../../../utils/logger';
import getClient from '../getClient';

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
      'lesgo.services.DynamoDbService.getClient::NEW_CLIENT_SINGLETON',
      {
        client,
        region: 'us-west-2',
      }
    );

    expect(client).toBeInstanceOf(DynamoDBDocumentClient);
  });

  it('should return the existing client if singleton connection is already created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    const client1 = getClient({ region, singletonConn });
    const client2 = getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.DynamoDbService.getClient::REUSE_CLIENT_SINGLETON',
      {
        client: client1,
        region: 'us-west-2',
      }
    );
    expect(client2).toBe(client1);
  });
});
