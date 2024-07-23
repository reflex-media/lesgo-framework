import getDownloadSignedUrl from '../getDownloadSignedUrl';
import getDownloadSignedUrlService from '../../../services/S3Service/getDownloadSignedUrl';
import s3Utils from '../../../utils/s3';

jest.mock('../../../services/S3Service/getDownloadSignedUrl');

describe('getDownloadSignedUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getDownloadSignedUrlService with default bucket, singletonConn, region, and expiresIn', () => {
    const key = 'testKey';

    getDownloadSignedUrl(key);

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(
      key,
      undefined,
      undefined,
      undefined
    );
  });

  it('should call getDownloadSignedUrlService with specified singletonConn, config region, and expiresIn', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const expiresIn = 1800;

    s3Utils.getDownloadSignedUrl(
      key,
      { Bucket: bucket },
      { expiresIn },
      {
        singletonConn,
        region,
      }
    );

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      { expiresIn },
      {
        singletonConn,
        region,
      }
    );
  });

  it('should call getDownloadSignedUrlService with default singletonConn, specified region, and expiresIn', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';
    const expiresIn = 1800;

    getDownloadSignedUrl(key, { Bucket: bucket }, { expiresIn }, { region });

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      { expiresIn },
      { region }
    );
  });

  it('should call getDownloadSignedUrlService with specified singletonConn, specified region, and expiresIn', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const expiresIn = 1800;

    getDownloadSignedUrl(
      key,
      { Bucket: bucket },
      { expiresIn },
      {
        singletonConn,
        region,
      }
    );

    expect(getDownloadSignedUrlService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      { expiresIn },
      {
        singletonConn,
        region,
      }
    );
  });
});
