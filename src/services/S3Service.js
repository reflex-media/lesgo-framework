import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import isEmpty from '../utils/isEmpty';
import LesgoException from '../exceptions/LesgoException';

export default class S3Service {
  constructor() {
    this.s3ClientInstance = new S3Client({});
  }

  /**
   * Get S3 bucket object
   *
   * @param {String} key
   * @param {string} bucket
   */
  async getObject(key, bucket) {
    if (isEmpty(key)) {
      throw new LesgoException(
        'Key is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_KEY_UNDEFINED'
      );
    }

    if (isEmpty(bucket)) {
      throw new LesgoException(
        'Bucket is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_BUCKET_UNDEFINED'
      );
    }

    try {
      const response = await this.s3ClientInstance.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        })
      );
      return response;
    } catch (error) {
      throw new LesgoException(
        'Error occured getting object from S3 bucket',
        'S3SERVICE_GETOBJECT_COMMAND_ERROR',
        500,
        { error, key, bucket }
      );
    }
  }
}
