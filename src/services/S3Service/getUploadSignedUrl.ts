import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import getClient from './getClient';

export interface GetUploadSignedUrlOptions {
  singletonConn: string;
  region: string;
  expiresIn: number;
  metadata?: Record<string, string>;
}

const getUploadSignedUrl = (
  key: string,
  bucket: string,
  { singletonConn, region, expiresIn, metadata }: GetUploadSignedUrlOptions
) => {
  const client = getClient({ region, singletonConn });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Metadata: metadata,
  });

  return getSignedUrl(client, command, { expiresIn });
};

export default getUploadSignedUrl;
