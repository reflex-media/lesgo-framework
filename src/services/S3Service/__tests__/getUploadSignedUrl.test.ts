import { PutObjectCommand } from '@aws-sdk/client-s3';
import S3Service from '../../S3Service';
import getUploadSignedUrl from '../getUploadSignedUrl';
import getClient from '../getClient';

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
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
      expiresIn: 3600,
    };

    await getUploadSignedUrl(key, bucket, options);

    expect(getClient).toHaveBeenCalledWith({
      region: options.region,
      singletonConn: options.singletonConn,
    });
  });

  it('should return the signed URL', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
      expiresIn: 3600,
    };

    const result = await S3Service.getUploadSignedUrl(key, bucket, options);

    expect(result).toBe('https://test-url.com');
  });
});
