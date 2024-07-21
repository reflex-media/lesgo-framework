import { StorageClass } from '@aws-sdk/client-s3';
import s3Config from '../../config/s3';
import putObjectService from '../../services/S3Service/putObject';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';

const putObject = async (
  key: string,
  file: Buffer | Uint8Array | Blob | string,
  bucket?: string,
  { singletonConn = 'default', region = '', storageClass = 'STANDARD' } = {}
) => {
  region = isEmpty(region) ? s3Config.region : region;
  bucket = isEmpty(bucket) ? s3Config.bucket : bucket;

  const input = validateFields(
    { key, bucket, singletonConn, region, storageClass },
    [
      { key: 'key', type: 'string', required: true },
      { key: 'bucket', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
      { key: 'storageClass', type: 'string', required: true },
    ]
  );

  return putObjectService(input.key, file, input.bucket, {
    singletonConn: input.singletonConn,
    region: input.region,
    storageClass:
      (input.storageClass as StorageClass | 'STANDARD') || 'STANDARD',
  });
};

export default putObject;
