import getHeadObject from '../getHeadObject';
import getHeadObjectService from '../../../services/S3Service/getHeadObject';
import s3Utils from '../../../utils/s3';
import config from '../../../config/aws';

jest.mock('../../../services/S3Service/getHeadObject');
jest.mock('../../../config/aws');

describe('getHeadObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getHeadObjectService with default bucket, singletonConn and region', () => {
    const key = 'testKey';

    getHeadObject(key);

    expect(getHeadObjectService).toHaveBeenCalledWith(key, config.s3.bucket, {
      singletonConn: 'default',
      region: config.region,
    });
  });

  it('should call getHeadObjectService with specified singletonConn and config region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';

    s3Utils.getHeadObject(key, bucket, { singletonConn });

    expect(getHeadObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region: config.region,
    });
  });

  it('should call getHeadObjectService with default singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';

    getHeadObject(key, bucket, { region });

    expect(getHeadObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn: 'default',
      region,
    });
  });

  it('should call getHeadObjectService with specified singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    getHeadObject(key, bucket, { singletonConn, region });

    expect(getHeadObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region,
    });
  });
});
