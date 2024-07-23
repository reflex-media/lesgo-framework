import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import LesgoException from '../../exceptions/LesgoException';
import s3Config from '../../config/s3';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';

const FILE = 'lesgo/services/S3Service/putObject';

export interface PutObjectOptions
  extends Partial<Omit<PutObjectCommandInput, 'Key' | 'Bucket'>> {
  Key?: string;
  Bucket?: string;
}

const putObject = async (
  key: string,
  file: Buffer | Uint8Array | Blob | string,
  opts?: PutObjectOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = getClient(clientOpts);
  const commandInput: PutObjectCommandInput = {
    Bucket: opts?.Bucket || s3Config.bucket,
    Key: input.key,
    Body: file,
    StorageClass: opts?.StorageClass || 'STANDARD',
    ...opts,
  };

  try {
    const response = await client.send(new PutObjectCommand(commandInput));
    logger.debug(`${FILE}::RESPONSE`, { response, commandInput });

    return response;
  } catch (error) {
    throw new LesgoException(
      'Error occurred putting object to S3 bucket',
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

export default putObject;
