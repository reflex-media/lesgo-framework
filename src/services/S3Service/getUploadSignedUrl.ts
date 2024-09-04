import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger, validateFields } from '../../utils';
import s3Config from '../../config/s3';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import { PutObjectOptions } from './putObject';

const FILE = 'lesgo.services.S3Service.getUploadSignedUrl';

export interface GetSignedUrlOptions {
  expiresIn?: number;
}

const getUploadSignedUrl = async (
  key: string,
  opts?: PutObjectOptions,
  signingOpts?: GetSignedUrlOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = getClient(clientOpts);

  const commandInput: PutObjectCommandInput = {
    Bucket: opts?.Bucket || s3Config.bucket,
    Key: input.key,
    ...opts,
  };
  const command = new PutObjectCommand(commandInput);

  signingOpts = {
    expiresIn: 3600,
    ...signingOpts,
  };

  const resp = await getSignedUrl(client, command, signingOpts);
  logger.debug(`${FILE}::RESPONSE`, { resp, commandInput, signingOpts });

  return resp;
};

export default getUploadSignedUrl;
