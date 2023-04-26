import { getObject } from '../../services/S3Service';

export default (bucket = '', key = '', singletonConn = 'default') => {
  return getObject(bucket, key, singletonConn);
};
