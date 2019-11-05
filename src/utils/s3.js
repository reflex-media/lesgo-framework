import S3Service from '../services/S3Service';
import { aws } from '../config';

const s3 = new S3Service(aws.s3.options);

export const getObject = (objectKey, bucketName) => {
  return s3.getObject(objectKey, bucketName);
};

export default s3;
