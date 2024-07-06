import config from '../../config/aws';
import getHeadObjectService from '../../services/S3Service/getHeadObject';

const getHeadObject = (
  key: string,
  bucket: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  const configRegion = config.region;

  return getHeadObjectService(key, bucket, {
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};

export default getHeadObject;
