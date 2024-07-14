import { PutObjectCommand, StorageClass } from '@aws-sdk/client-s3';
import LesgoException from '../../../exceptions/LesgoException';
import putObject from '../putObject';
import getClient from '../getClient';

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof PutObjectCommand) {
        return Promise.resolve(command);
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});

describe('putObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct region and singletonConn', async () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
      storageClass: StorageClass.STANDARD,
    };

    await putObject(key, file, bucket, options);

    expect(getClient).toHaveBeenCalledWith({
      region: options.region,
      singletonConn: options.singletonConn,
    });
  });

  it('should return the response from the client', async () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
      storageClass: StorageClass.STANDARD,
    };
    const response = {
      /* mock response */
    };

    (getClient as jest.Mock).mockReturnValueOnce({
      send: jest.fn().mockResolvedValue(response),
    });

    const result = await putObject(key, file, bucket, options);

    expect(result).toBe(response);
  });

  it('should throw a LesgoException if an error occurs', async () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
      storageClass: StorageClass.STANDARD,
    };
    const error = new Error('Test error');

    (getClient as jest.Mock).mockReturnValueOnce({
      send: jest.fn().mockRejectedValueOnce(error),
    });

    await expect(putObject(key, file, bucket, options)).rejects.toThrow(
      new LesgoException(
        'Error occurred putting object to S3 bucket',
        'lesgo.services.S3Service.putObject::ERROR',
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
