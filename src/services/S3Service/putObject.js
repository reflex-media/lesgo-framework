import { PutObjectCommand } from '@aws-sdk/client-s3';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';

const FILE = 'services/S3Service/putObject';

const putObject = async (key, bucket, { region, singleConn }) => {
  if (isEmpty(key)) {
    throw new LesgoException('Key is undefined', `${FILE}::KEY_UNDEFINED`);
  }

  if (isEmpty(bucket)) {
    throw new LesgoException(
      'Bucket is undefined',
      `${FILE}::BUCKET_UNDEFINED`
    );
  }

  const client = getClient({ region, singleConn });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
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
      }
    );
  }
};

export default putObject;
