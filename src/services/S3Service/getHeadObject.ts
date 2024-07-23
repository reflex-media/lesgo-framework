import { HeadObjectCommand, HeadObjectCommandInput } from '@aws-sdk/client-s3';
import s3Config from '../../config/s3';
import LesgoException from '../../exceptions/LesgoException';
import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';

const FILE = 'lesgo/services/S3Service/getHeadObject';

export type HeadObjectOptions = Omit<HeadObjectCommandInput, 'Key'> & {
  Key?: string;
};

const getHeadObject = async (
  key: string,
  opts?: HeadObjectOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = getClient(clientOpts);

  const commandInput: HeadObjectCommandInput = {
    Bucket: opts?.Bucket || s3Config.bucket,
    Key: input.key,
    ...opts,
  };

  try {
    const response = await client.send(new HeadObjectCommand(commandInput));
    const { LastModified, ContentLength, ETag, ContentType, Metadata } =
      response;

    logger.debug(`${FILE}::RESPONSE`, {
      LastModified,
      ContentLength,
      ETag,
      ContentType,
      Metadata,
      response,
      commandInput,
    });

    return { LastModified, ContentLength, ETag, ContentType, Metadata };
  } catch (error) {
    throw new LesgoException(
      'Error occurred getting object metadata from S3 bucket',
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

export default getHeadObject;
