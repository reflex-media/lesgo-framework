import getObject from '../getObject';
import getObjectService from '../../../services/S3Service/getObject';
import s3Utils from '../../../utils/s3';
import awsConfig from '../../../config/aws';
import config from '../../../config';

jest.mock('../../../services/S3Service/getObject');

describe('getObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getObjectService with default bucket, singletonConn and awsConfig region', () => {
    const key = 'testKey';

    getObject(key);

    expect(getObjectService).toHaveBeenCalledWith(key, awsConfig.s3.bucket, {
      singletonConn: 'default',
      region: awsConfig.region,
    });
  });

  it('should call getObjectService with specified singletonConn and awsConfig region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';

    s3Utils.getObject(key, bucket, { singletonConn });

    expect(getObjectService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region: config.aws.region,
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
