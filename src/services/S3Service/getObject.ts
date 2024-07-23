import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import LesgoException from '../../exceptions/LesgoException';
import s3Config from '../../config/s3';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';

const FILE = 'lesgo.services.S3Service.getObject';

export interface GetObjectOptions
  extends Partial<Omit<GetObjectCommandInput, 'Key' | 'Bucket'>> {
  Key?: string;
  Bucket?: string;
}

export const streamToBuffer = async (stream?: any): Promise<Buffer> => {
  if (!stream || !(stream instanceof Readable)) {
    throw new LesgoException(
      'Data is not a readable stream',
      `${FILE}::ERROR_NOT_READABLE_STREAM`
    );
  }

  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

const getObject = async (
  key: string,
  opts?: GetObjectOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = getClient(clientOpts);

  const commandInput: GetObjectCommandInput = {
    Bucket: opts?.Bucket || s3Config.bucket,
    Key: input.key,
    ...opts,
  };

  try {
    const resp = await client.send(new GetObjectCommand(commandInput));
    logger.debug(`${FILE}::RESPONSE`, { resp, commandInput });

    return resp;
  } catch (error) {
    throw new LesgoException(
      'Error occurred getting object from S3 bucket',
      `${FILE}::ERROR`,
      500,
      {
        error,
        commandInput,
        opts,
        clientOpts,
      }
    );
  }
};

export default getObject;
