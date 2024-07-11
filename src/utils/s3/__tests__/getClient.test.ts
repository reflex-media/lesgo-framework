import getClient from '../getClient';
import getClientService from '../../../services/S3Service/getClient';
import s3Utils from '../../../utils/s3';
import config from '../../../config/aws';

jest.mock('../../../services/S3Service/getClient');
jest.mock('../../../config/aws');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClientService with default singletonConn and config region', () => {
    getClient();

    expect(getClientService).toHaveBeenCalledWith({
      singletonConn: 'default',
      region: config.region,
    });
  });

  it('should call getClientService with specified singletonConn and config region', () => {
    const singletonConn = 'customSingletonConn';
    s3Utils.getClient({ singletonConn });

    expect(getClientService).toHaveBeenCalledWith({
      singletonConn,
      region: config.region,
    });
  });

  it('should call getClientService with default singletonConn and specified region', () => {
    const region = 'us-west-2';
    getClient({ region });

    expect(getClientService).toHaveBeenCalledWith({
      singletonConn: 'default',
      region,
    });
  });

  it('should call getClientService with specified singletonConn and specified region', () => {
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    getClient({ singletonConn, region });

    expect(getClientService).toHaveBeenCalledWith({
      singletonConn,
      region,
    });
  });
});
