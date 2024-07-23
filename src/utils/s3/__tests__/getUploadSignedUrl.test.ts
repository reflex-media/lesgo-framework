import getUploadSignedUrl from '../getUploadSignedUrl';
import getUploadSignedUrlService from '../../../services/S3Service/getUploadSignedUrl';
import s3Utils from '../../../utils/s3';

jest.mock('../../../services/S3Service/getUploadSignedUrl');

describe('getUploadSignedUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getUploadSignedUrlService with default bucket, singletonConn, config region, and provided parameters', () => {
    const key = 'testKey';

    getUploadSignedUrl(key);

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(
      key,
      undefined,
      undefined,
      undefined
    );
  });

  it('should call getUploadSignedUrlService with specified singletonConn, config region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    s3Utils.getUploadSignedUrl(
      key,
      { Bucket: bucket, Metadata: metadata },
      { expiresIn },
      {
        singletonConn,
      }
    );

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket, Metadata: metadata },
      { expiresIn },
      { singletonConn }
    );
  });

  it('should call getUploadSignedUrlService with default singletonConn, specified region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    getUploadSignedUrl(
      key,
      { Bucket: bucket, Metadata: metadata },
      { expiresIn },
      { region }
    );

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket, Metadata: metadata },
      { expiresIn },
      { region }
    );
  });

  it('should call getUploadSignedUrlService with specified singletonConn, specified region, and provided parameters', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const metadata = { foo: 'bar' };
    const expiresIn = 600;

    getUploadSignedUrl(
      key,
      { Bucket: bucket, Metadata: metadata },
      { expiresIn },
      {
        singletonConn,
        region,
      }
    );

    expect(getUploadSignedUrlService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket, Metadata: metadata },
      { expiresIn },
      {
        singletonConn,
        region,
      }
    );
  });
});
