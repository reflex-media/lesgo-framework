import { getObject } from '../../services/S3Service';

export default (key = '', bucket = '', singletonConn = 'default') => {
  return getObject(key, bucket, singletonConn);
};
