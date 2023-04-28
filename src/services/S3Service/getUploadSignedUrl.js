import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import getClient from './getClient';

export default (
  key = '',
  bucket = '',
  { singletonConn = 'default', region = '', expiresIn = 600 } = {}
) => {
  const client = getClient({ region, singletonConn });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });

  return getSignedUrl(client, command, { expiresIn });
};
