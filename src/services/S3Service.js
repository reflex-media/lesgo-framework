// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from 'aws-sdk';

import LesgoException from '../exceptions/LesgoException';

export default class S3Service {
  constructor(
    opts = {
      accessKeyId: null,
      secretAccessKey: null,
      region: null,
    }
  ) {
    let options = {};

    if (opts.accessKeyId !== null && opts.accessKeyId !== undefined) {
      options = { ...options, accessKeyId: opts.accessKeyId };
    }
    if (opts.secretAccessKey !== null && opts.secretAccessKey !== undefined) {
      options = { ...options, secretAccessKey: opts.secretAccessKey };
    }
    if (opts.region !== null && opts.region !== undefined) {
      options = { ...options, region: opts.region };
    }

    this.s3Instance = new S3({
      ...{ ...options },
    });
  }

  /**
   * Get S3 bucket object
   *
   * @param {object} payload
   * @param {string} queueName
   */
  getObject(key, bucket) {
    if (key === undefined || key === null) {
      throw new LesgoException(
        'Key is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_KEY_UNDEFINED'
      );
    }

    if (bucket === undefined || bucket === null) {
      throw new LesgoException(
        'Bucket is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_BUCKET_UNDEFINED'
      );
    }

    return this.s3Instance
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }
}
