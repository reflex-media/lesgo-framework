import { HeadObjectCommand } from '@aws-sdk/client-s3';
import S3Service from '../../S3Service';
import getHeadObject from '../getHeadObject';
import getClient from '../getClient';
import { LesgoException } from '../../../exceptions';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof HeadObjectCommand) {
        return Promise.resolve(command);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});

describe('getHeadObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if key is empty', async () => {
    const key = '';
    const bucket = 'testBucket';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await expect(getHeadObject(key, bucket, options)).rejects.toThrow(
      new LesgoException(
        'Key is undefined',
        'lesgo.services.S3Service.getHeadObject::KEY_UNDEFINED'
      )
    );
  });

  it('should throw an error if bucket is undefined', async () => {
    const key = 'testKey';
    const bucket = '';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await expect(S3Service.getHeadObject(key, bucket, options)).rejects.toThrow(
      new LesgoException(
        'Bucket is undefined',
        'lesgo.services.S3Service.getHeadObject::BUCKET_UNDEFINED'
      )
    );
  });

  it('should call getClient with the correct region and singletonConn', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await getHeadObject(key, bucket, options);

    expect(getClient).toHaveBeenCalledWith({
      region: options.region,
      singletonConn: options.singletonConn,
    });
  });

  it('should call GetObjectCommand with the correct bucket and key', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await expect(getHeadObject(key, bucket, options)).resolves.toMatchObject({
      ContentLength: undefined,
      ContentType: undefined,
      ETag: undefined,
      LastModified: undefined,
      Metadata: undefined,
    });
  });

  it('should throw a LesgoException if an error occurs', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };
    const error = new Error('Test error');

    (getClient as jest.Mock).mockReturnValueOnce({
      send: jest.fn().mockRejectedValueOnce(error),
    });

    await expect(getHeadObject(key, bucket, options)).rejects.toThrow(
      new LesgoException(
        'Error occurred getting object metadata from S3 bucket',
        'lesgo.services.S3Service.getHeadObject::ERROR',
        500,
        {
          error,
          bucket,
          key,
        }
      )
    );
  });
});
