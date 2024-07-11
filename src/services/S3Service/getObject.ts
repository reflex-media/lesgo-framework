import { GetObjectCommand } from '@aws-sdk/client-s3';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../../utils/isEmpty';

const FILE = 'lesgo.services.S3Service.getObject';

export interface GetObjectOptions {
  region: string;
  singletonConn: string;
}

const getObject = async (
  key: string,
  bucket: string,
  { region, singletonConn }: GetObjectOptions
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

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    // const str = await response.Body.transformToString();

    return response;
  } catch (error) {
    throw new LesgoException(
      'Error occurred getting object from S3 bucket',
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

export default getObject;
