import putObject from '../putObject';
import putObjectService from '../../../services/S3Service/putObject';
import s3Utils from '../../../utils/s3';
import config from '../../../config/aws';

jest.mock('../../../services/S3Service/putObject');
jest.mock('../../../config/aws');

describe('putObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call putObjectService with default singletonConn, config region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');

    putObject(key, bucket, file);

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn: 'default',
      region: config.region,
      storageClass: 'STANDARD',
    });
  });

  it('should call putObjectService with specified singletonConn, config region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';

    s3Utils.putObject(key, bucket, file, { singletonConn });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn,
      region: config.region,
      storageClass: 'STANDARD',
    });
  });

  it('should call putObjectService with default singletonConn, specified region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const region = 'us-west-2';

    putObject(key, bucket, file, { region });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn: 'default',
      region,
      storageClass: 'STANDARD',
    });
  });

  it('should call putObjectService with specified singletonConn, specified region, and STANDARD storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    putObject(key, bucket, file, { singletonConn, region });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn,
      region,
      storageClass: 'STANDARD',
    });
  });

  it('should call putObjectService with default singletonConn, config region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(key, bucket, file, { storageClass });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn: 'default',
      region: config.region,
      storageClass,
    });
  });

  it('should call putObjectService with specified singletonConn, config region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(key, bucket, file, { singletonConn, storageClass });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn,
      region: config.region,
      storageClass,
    });
  });

  it('should call putObjectService with default singletonConn, specified region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const region = 'us-west-2';
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(key, bucket, file, { region, storageClass });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn: 'default',
      region,
      storageClass,
    });
  });

  it('should call putObjectService with specified singletonConn, specified region, and specified storageClass', () => {
    const key = 'test-key';
    const bucket = 'test-bucket';
    const file = Buffer.from('test-file');
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';
    const storageClass = 'REDUCED_REDUNDANCY';

    putObject(key, bucket, file, { singletonConn, region, storageClass });

    expect(putObjectService).toHaveBeenCalledWith(key, bucket, file, {
      singletonConn,
      region,
      storageClass,
    });
  });
});
