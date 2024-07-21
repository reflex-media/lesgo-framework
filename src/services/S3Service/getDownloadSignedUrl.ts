import { GetObjectCommand, GetObjectCommandInput } from '@aws-sdk/client-s3';
import {
  getSignedUrl,
  S3RequestPresignerOptions,
} from '@aws-sdk/s3-request-presigner';
import getClient, { GetClientOptions } from './getClient';

const getDownloadSignedUrl = (
  key: string,
  bucket?: string,
  opts?: GetObjectCommandInput & S3RequestPresignerOptions,
  clientOpts?: GetClientOptions
) => {
  const client = getClient(clientOpts);
  const command = new GetObjectCommand({
    ...opts,
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, opts);
};

export default getDownloadSignedUrl;
