import getClientService from '../../../services/S3Service/getClient';
import { getClient } from '../../../utils/s3';

jest.mock('../../../services/S3Service/getClient');
jest.mock('../../../config/aws');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClientService with default singletonConn and config region', () => {
    getClient();

    expect(getClientService).toHaveBeenCalledWith(undefined);
  });

  it('should call getClientService with specified singletonConn and config region', () => {
    const singletonConn = 'customSingletonConn';
    getClient({ singletonConn });

    expect(getClientService).toHaveBeenCalledWith({
      singletonConn,
    });
  });

  it('should call getClientService with default singletonConn and specified region', () => {
    const region = 'us-west-2';
    getClient({ region });

    expect(getClientService).toHaveBeenCalledWith({
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
