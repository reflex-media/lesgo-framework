// @ts-ignore
import config from 'config/s3';
import getClientService from '../../services/S3Service/getClient';

const getClient = ({ singletonConn = 'default', region = '' } = {}) => {
  const configRegion = config.region;

  return getClientService({
    singletonConn,
    region: region !== '' ? region : configRegion,
  });
};

export default getClient;
