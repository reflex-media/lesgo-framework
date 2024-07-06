import { StorageClass } from '@aws-sdk/client-s3';
import config from '../../config/aws';
import putObjectService from '../../services/S3Service/putObject';

const putObject = (
  key: string,
  bucket: string,
  file: Buffer | Uint8Array | Blob | string,
  { singletonConn = 'default', region = '', storageClass = 'STANDARD' } = {}
) => {
  const configRegion = config.region;

  return putObjectService(key, bucket, file, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    storageClass: (storageClass as StorageClass | 'STANDARD') || 'STANDARD',
  });
};

export default putObject;
