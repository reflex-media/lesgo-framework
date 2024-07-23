import { Readable } from 'stream';
import getObject from '../getObject';
import getObjectService from '../../../services/S3Service/getObject';
import s3Utils from '../../../utils/s3';

jest.mock('../../../services/S3Service/getObject');

const mockReadableStream = () => {
  const readable = new Readable();
  readable.push('mock data');
  readable.push(null); // No more data
  return readable;
};

const getObjectResponse = {
  Body: mockReadableStream,
};

describe('getObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getObjectService with default bucket, singletonConn and awsConfig region', () => {
    const key = 'testKey';

    (getObjectService as jest.Mock).mockResolvedValueOnce(getObjectResponse);

    getObject(key);

    expect(getObjectService).toHaveBeenCalledWith(key, undefined, undefined);
  });

  it('should call getObjectService with specified singletonConn and awsConfig region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';

    (getObjectService as jest.Mock).mockResolvedValueOnce(getObjectResponse);

    s3Utils.getObject(key, { Bucket: bucket }, { singletonConn });

    expect(getObjectService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      {
        singletonConn,
      }
    );
  });

  it('should call getObjectService with default singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';

    (getObjectService as jest.Mock).mockResolvedValueOnce(getObjectResponse);

    getObject(key, { Bucket: bucket }, { region });

    expect(getObjectService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      {
        region,
      }
    );
  });

  it('should call getObjectService with specified singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    (getObjectService as jest.Mock).mockResolvedValueOnce(getObjectResponse);

    getObject(key, { Bucket: bucket }, { singletonConn, region });

    expect(getObjectService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      {
        singletonConn,
        region,
      }
    );
  });
});
