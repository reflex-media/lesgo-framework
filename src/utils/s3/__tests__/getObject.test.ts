import getObject from '../getObject';
import getObjectService from '../../../services/S3Service/getObject';
import s3Utils from '../../../utils/s3';
import config from '../../../config/aws';

jest.mock('../../../services/S3Service/getObject');
jest.mock('../../../config/aws');

describe('getObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getObjectService with default singletonConn and config region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';

    getObject(key, bucket);

    expect(getObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn: 'default',
      region: config.region,
    });
  });

  it('should call getObjectService with specified singletonConn and config region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';

    s3Utils.getObject(key, bucket, { singletonConn });

    expect(getObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region: config.region,
    });
  });

  it('should call getObjectService with default singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';

    getObject(key, bucket, { region });

    expect(getObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn: 'default',
      region,
    });
  });

  it('should call getObjectService with specified singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    getObject(key, bucket, { singletonConn, region });

    expect(getObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region,
    });
  });
});
