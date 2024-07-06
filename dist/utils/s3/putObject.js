import config from '../../config/aws';
import putObjectService from '../../services/S3Service/putObject';
const putObject = (
  key,
  bucket,
  file,
  { singletonConn = 'default', region = '', storageClass = 'STANDARD' } = {}
) => {
  const configRegion = config.region;
  return putObjectService(key, bucket, file, {
    singletonConn,
    region: region !== '' ? region : configRegion,
    storageClass: storageClass || 'STANDARD',
  });
};
export default putObject;
