import config from 'Config/aws'; // eslint-disable-line import/no-unresolved
import S3Service from '../services/S3Service';

const s3 = new S3Service(config.s3.options);

const getObject = (objectKey, bucketName) => {
  return s3.getObject(objectKey, bucketName);
};

export { getObject };
export default s3;
