import getClient from '../getClient';
import S3Service from '../../S3Service';
import logger from '../../../utils/logger';

jest.mock('../../../utils/logger');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new client if singleton connection is not yet created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.S3Service.getClient::NEW_CLIENT',
      {
        client: undefined,
      }
    );
  });

  it('should return the existing client if singleton connection is already created', () => {
    const region = 'us-west-2';
    const singletonConn = 'default';

    const client1 = getClient({ region, singletonConn });
    S3Service.getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.S3Service.getClient::REUSE_CLIENT_SINGLETON',
      {
        client: client1,
      }
    );
  });
});
