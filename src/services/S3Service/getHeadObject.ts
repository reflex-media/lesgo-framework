import { HeadObjectCommand } from '@aws-sdk/client-s3';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';

const FILE = 'lesgo/services/S3Service/getHeadObject';

interface GetHeadObjectOptions {
  region: string;
  singletonConn: string;
}

const getHeadObject = async (
  key: string,
  bucket: string,
  { region, singletonConn }: GetHeadObjectOptions
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

  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await client.send(command);
    const { LastModified, ContentLength, ETag, ContentType, Metadata } =
      response;

    return { LastModified, ContentLength, ETag, ContentType, Metadata };
  } catch (error) {
    throw new LesgoException(
      'Error occurred getting object metadata from S3 bucket',
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

export default getHeadObject;
