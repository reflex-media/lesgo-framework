import { StorageClass } from '@aws-sdk/client-s3';
// @ts-ignore
import config from 'config/s3';
import putObjectService from '../../services/S3Service/putObject';

const putObject = (
  key: string,
  bucket: string,
  file: string,
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
