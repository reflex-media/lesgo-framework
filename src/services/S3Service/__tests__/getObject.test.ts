import { GetObjectCommand } from '@aws-sdk/client-s3';
import getObject from '../getObject';
import getClient from '../getClient';
import { LesgoException } from '../../../exceptions';
import { Readable } from 'stream';

const readableStream = new Readable({
  read() {
    this.push('Your stream content here');
    this.push(null);
  },
});

jest.mock('../getClient', () => {
  return jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(command => {
      if (command instanceof GetObjectCommand) {
        return Promise.resolve({
          Body: readableStream,
        });
      }

      return Promise.reject(new Error('Command not mocked'));
    }),
  }));
});

describe('getObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct region and singletonConn', async () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const options = {
      region: 'us-west-2',
      singletonConn: 'default',
    };

    await getObject(key, { Bucket: bucket }, options);

    expect(getClient).toHaveBeenCalledWith({
      region: options.region,
      singletonConn: options.singletonConn,
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

    await expect(getObject(key, { Bucket: bucket }, options)).rejects.toThrow(
      new LesgoException(
        'Error occurred getting object from S3 bucket',
        'lesgo.services.S3Service.getObject::ERROR',
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
