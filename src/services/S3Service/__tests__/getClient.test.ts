import getClient from '../getClient';
import logger from '../../../utils/logger';
import s3Config from '../../../config/s3';

jest.mock('../../../utils/logger');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new client if singleton connection is not yet created', () => {
    const region = 'us-west-2';
    const singletonConn = 'cusom1';

    getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.S3Service.getClient::NEW_CLIENT',
      {
        region: 'us-west-2',
      }
    );
  });

  it('should return the existing client if singleton connection is already created', () => {
    const region = 'us-west-2';
    const singletonConn = 'custom2';

    getClient({ region, singletonConn });
    getClient({ region, singletonConn });

    expect(logger.debug).toHaveBeenCalledTimes(2);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.S3Service.getClient::REUSE_CLIENT_SINGLETON',
      {
        region: 'us-west-2',
      }
    );
  });

  it('should create a new client with default options if none provided', () => {
    getClient();

    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(logger.debug).toHaveBeenCalledWith(
      'lesgo.services.S3Service.getClient::NEW_CLIENT',
      {
        region: s3Config.region,
      }
    );
  });
});
