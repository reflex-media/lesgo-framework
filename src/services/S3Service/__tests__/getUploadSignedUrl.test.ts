import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getClient, getUploadSignedUrl } from '../../S3Service';

jest.mock('../getClient');
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: jest.fn().mockImplementation((client, command) => {
      if (command instanceof PutObjectCommand) {
        return Promise.resolve('https://test-url.com');
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  };
});

describe('getUploadSignedUrl', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct region and singletonConn', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const expiresIn = 3600;
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await getUploadSignedUrl(key, { Bucket: bucket }, { expiresIn }, options);

    expect(getClient).toHaveBeenCalledWith({
      region: options.region,
      singletonConn: options.singletonConn,
    });
  });

  it('should return the signed URL', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const expiresIn = 3600;
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    const result = await getUploadSignedUrl(
      key,
      { Bucket: bucket },
      { expiresIn },
      options
    );

    expect(result).toBe('https://test-url.com');
  });

  it('should return the signed URL with default options', async () => {
    const key = 'testKey';

    const result = await getUploadSignedUrl(key);

    expect(result).toBe('https://test-url.com');
  });
});
