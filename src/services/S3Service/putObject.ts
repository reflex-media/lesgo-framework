import { PutObjectCommand, StorageClass } from '@aws-sdk/client-s3';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';
import getClient from './getClient';

const FILE = 'lesgo/services/S3Service/putObject';

export interface PutObjectOptions {
  region: string;
  singletonConn: string;
  storageClass: StorageClass;
}

const putObject = async (
  key: string,
  bucket: string,
  file: Buffer | Uint8Array | Blob | string,
  { region, singletonConn, storageClass }: PutObjectOptions
) => {
  if (isEmpty(key)) {
    throw new LesgoException('Key is undefined', `${FILE}::KEY_UNDEFINED`);
  }

  if (isEmpty(bucket)) {
    throw new LesgoException(
      'Bucket is undefined',
      `${FILE}::BUCKET_UNDEFINED`
    );
  }

  const client = getClient({ region, singletonConn });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    StorageClass: storageClass,
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    throw new LesgoException(
      'Error occurred putting object to S3 bucket',
      `${FILE}::ERROR`,
      500,
      {
        error,
        bucket,
        key,
        storageClass,
      }
    );
  }
};

export default putObject;
