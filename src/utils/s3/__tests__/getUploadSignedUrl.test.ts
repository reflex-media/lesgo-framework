import getUploadSignedUrl from '../getUploadSignedUrl';
import getUploadSignedUrlService from '../../../services/S3Service/getUploadSignedUrl';
import s3Utils from '../../../utils/s3';
import config from '../../../config/aws';

jest.mock('../../../services/S3Service/getUploadSignedUrl');
jest.mock('../../../config/aws');

describe('getUploadSignedUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getUploadSignedUrlService with default singletonConn, config region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    getUploadSignedUrl(key, bucket, { metadata, expiresIn });

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn: 'default',
      region: config.region,
      metadata,
      expiresIn,
    });
  });

  it('should call getUploadSignedUrlService with specified singletonConn, config region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    s3Utils.getUploadSignedUrl(key, bucket, {
      singletonConn,
      metadata,
      expiresIn,
    });

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region: config.region,
      metadata,
      expiresIn,
    });
  });

  it('should call getUploadSignedUrlService with default singletonConn, specified region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    getUploadSignedUrl(key, bucket, { region, metadata, expiresIn });

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn: 'default',
      region,
      metadata,
      expiresIn,
    });
  });

  it('should call getUploadSignedUrlService with specified singletonConn, specified region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    getUploadSignedUrl(key, bucket, {
      singletonConn,
      region,
      metadata,
      expiresIn,
    });

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(key, bucket, {
      singletonConn,
      region,
      metadata,
      expiresIn,
    });
  });
});
