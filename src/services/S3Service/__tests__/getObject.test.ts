import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getClient, getObject } from '../../S3Service';
import { LesgoException } from '../../../exceptions';
import { Readable } from 'stream';
import { streamToBuffer } from '../getObject';

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

  it('should call getClient with the default options', async () => {
    const key = 'testKey';

    await getObject(key);

    expect(getClient).toHaveBeenCalledWith(undefined);
  });
});

describe('streamToBuffer', () => {
  it('should throw a LesgoException if the data is not a readable stream', async () => {
    const data = 'Not a readable stream';

    await expect(streamToBuffer(data)).rejects.toThrow(
      new LesgoException(
        'Data is not a readable stream',
        'lesgo.services.S3Service.getObject::ERROR_NOT_READABLE_STREAM'
      )
    );
  });

  it('should resolve with a buffer when given a readable stream', async () => {
    const readableStream = new Readable({
      read() {
        this.push('Your stream content here');
        this.push(null);
      },
    });

    const buffer = await streamToBuffer(readableStream);

    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.toString()).toBe('Your stream content here');
  });
});
