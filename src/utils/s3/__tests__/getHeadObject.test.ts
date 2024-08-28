import { getHeadObject } from '../../s3';
import getHeadObjectService from '../../../services/S3Service/getHeadObject';

jest.mock('../../../services/S3Service/getHeadObject');
jest.mock('../../../config/s3');

describe('getHeadObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getHeadObjectService with default bucket, singletonConn and region', () => {
    const key = 'testKey';

    getHeadObject(key);

    expect(getHeadObjectService).toHaveBeenCalledWith(
      key,
      undefined,
      undefined
    );
  });

  it('should call getHeadObjectService with specified singletonConn and config region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';

    getHeadObject(key, { Bucket: bucket }, { singletonConn });

    expect(getHeadObjectService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      { singletonConn }
    );
  });

  it('should call getHeadObjectService with default singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const region = 'us-west-2';

    getHeadObject(key, { Bucket: bucket }, { region });

    expect(getHeadObjectService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      { region }
    );
  });

  it('should call getHeadObjectService with specified singletonConn and specified region', () => {
    const key = 'testKey';
    const bucket = 'testBucket';
    const singletonConn = 'customSingletonConn';
    const region = 'us-west-2';

    getHeadObject(key, { Bucket: bucket }, { singletonConn, region });

    expect(getHeadObjectService).toHaveBeenCalledWith(
      key,
      { Bucket: bucket },
      {
        singletonConn,
        region,
      }
    );
  });
});
