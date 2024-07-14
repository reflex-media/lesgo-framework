import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import getClient from './getClient';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'lesgo.services.S3Service.getObject';

export interface GetObjectOptions {
  region: string;
  singletonConn: string;
}

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

const getObject = async (
  key: string,
  bucket: string,
  { region, singletonConn }: GetObjectOptions
) => {
  const client = getClient({ region, singletonConn });

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  let body;

  try {
    const { Body } = await client.send(command);
    body = Body;
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

  if (!body || !(body instanceof Readable)) {
    throw new LesgoException(
      'No data returned from S3 or data is not a readable stream',
      `${FILE}::ERROR_NO_DATA_OR_NOT_READABLE`,
      500,
      {
        bucket,
        key,
      }
    );
  }

  const objectBody = await streamToBuffer(body as Readable);
  return objectBody;
};

export default getObject;
