import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getClient, getDownloadSignedUrl } from '../../S3Service';

jest.mock('../getClient');
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: jest.fn().mockImplementation((client, command) => {
      if (command instanceof GetObjectCommand) {
        return Promise.resolve('https://test-url.com');
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  };
});

describe('getDownloadSignedUrl', () => {
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

    await getDownloadSignedUrl(key, { Bucket: bucket }, { expiresIn }, options);

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

    const result = await getDownloadSignedUrl(
      key,
      { Bucket: bucket },
      { expiresIn },
      options
    );

    expect(result).toBe('https://test-url.com');
  });

  it('should use the default options if none provided', async () => {
    const key = 'testKey';

    const result = await getDownloadSignedUrl(key);

    expect(result).toBe('https://test-url.com');
  });
});
