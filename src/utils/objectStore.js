import S3Service from '../services/S3Service';
import { aws } from '../config';

const objectStore = new S3Service(aws.s3.options);

const getObject = (objectKey, bucketName) => {
  return objectStore.getObject(objectKey, bucketName);
};

export { getObject };
export default objectStore;
