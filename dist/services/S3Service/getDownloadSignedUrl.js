import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import getClient from './getClient';
const getDownloadSignedUrl = (
  key,
  bucket,
  { singletonConn, region, expiresIn }
) => {
  const client = getClient({ region, singletonConn });
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
};
export default getDownloadSignedUrl;
