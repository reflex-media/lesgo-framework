import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import getClient from './getClient';
const getUploadSignedUrl = (
  key,
  bucket,
  { singletonConn, region, expiresIn, metadata }
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
