import { putObject } from '../../s3';
import putObjectService from '../../../services/S3Service/putObject';

jest.mock('../../../services/S3Service/putObject');
jest.mock('../../../config/aws');

describe('putObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call putObjectService with default singletonConn, config region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const file = Buffer.from('test-file');

    putObject(key, file);

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      undefined,
      undefined
    );
  });

  it('should call putObjectService with specified singletonConn, config region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';

    putObject(key, file, { Bucket: bucket }, { singletonConn });

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket },
      {
        singletonConn,
      }
    );
  });

  it('should call putObjectService with default singletonConn, specified region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const region = 'us-west-2';

    putObject(key, file, { Bucket: bucket }, { region });

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket },
      {
        region,
      }
    );
  });

  it('should call putObjectService with specified singletonConn, specified region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    putObject(key, file, { Bucket: bucket }, { singletonConn, region });

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket },
      {
        singletonConn,
        region,
      }
    );
  });

  it('should call putObjectService with default singletonConn, config region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(key, file, { Bucket: bucket, StorageClass: storageClass });

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      undefined
    );
  });

  it('should call putObjectService with specified singletonConn, config region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      { singletonConn }
    );

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      {
        singletonConn,
      }
    );
  });

  it('should call putObjectService with default singletonConn, specified region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const region = 'us-west-2';
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      { region }
    );

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      {
        region,
      }
    );
  });

  it('should call putObjectService with specified singletonConn, specified region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      { singletonConn, region }
    );

    expect(putObjectService).toHaveBeenCalledWith(
      key,
      file,
      { Bucket: bucket, StorageClass: storageClass },
      {
        singletonConn,
        region,
      }
    );
  });
});
