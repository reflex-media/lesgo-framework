import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Config from '../../config/s3';
import { validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import getClient from './getClient';
import { GetObjectOptions } from './getObject';

export interface GetSignedUrlOptions {
  expiresIn?: number;
}

const getDownloadSignedUrl = async (
  key: string,
  opts?: GetObjectOptions,
  signingOpts?: GetSignedUrlOptions,
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

  const command = new GetObjectCommand(commandInput);

  signingOpts = {
    expiresIn: 3600,
    ...signingOpts,
  };

  return getSignedUrl(client, command, signingOpts);
};

export default getDownloadSignedUrl;
