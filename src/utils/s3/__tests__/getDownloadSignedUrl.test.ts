import getDownloadSignedUrl from '../getDownloadSignedUrl';
import getDownloadSignedUrlService from '../../../services/S3Service/getDownloadSignedUrl';
import s3Utils from '../../../utils/s3';
import config from '../../../config/aws';

jest.mock('../../../services/S3Service/getDownloadSignedUrl');
jest.mock('../../../config/aws');

describe('getDownloadSignedUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getDownloadSignedUrlService with default bucket, singletonConn, region, and expiresIn', () => {
    const key = 'testKey';

    getDownloadSignedUrl(key);

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(
      key,
      config.s3.bucket,
      {
        singletonConn: 'default',
        region: config.region,
        expiresIn: 3600,
      }
    );
  });

  it('should call getDownloadSignedUrlService with specified singletonConn, config region, and expiresIn', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const expiresIn = 1800;

    s3Utils.getDownloadSignedUrl(key, bucket, {
      singletonConn,
      region,
      expiresIn,
    });

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region,
      expiresIn,
    });
  });

  it('should call getDownloadSignedUrlService with default singletonConn, specified region, and expiresIn', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';
    const expiresIn = 1800;

    getDownloadSignedUrl(key, bucket, {
      region,
      expiresIn,
    });

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn: 'default',
      region,
      expiresIn,
    });
  });

  it('should call getDownloadSignedUrlService with specified singletonConn, specified region, and expiresIn', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const expiresIn = 1800;

    getDownloadSignedUrl(key, bucket, {
      singletonConn,
      region,
      expiresIn,
    });

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region,
      expiresIn,
    });
  });
});
