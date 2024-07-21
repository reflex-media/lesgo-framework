import s3Config from '../../config/s3';
import getUploadSignedUrlService from '../../services/S3Service/getUploadSignedUrl';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';

const getUploadSignedUrl = async (
  key: string,
  bucket?: string,
  {
    singletonConn = 'default',
    region = '',
    metadata = undefined,
    expiresIn = 600,
  }: {
    singletonConn?: string;
    region?: string;
    metadata?: Record<string, string>;
    expiresIn?: number;
  } = {}
) => {
  region = isEmpty(region) ? s3Config.region : region;
  bucket = isEmpty(bucket) ? s3Config.bucket : bucket;

  const input = validateFields(
    { key, bucket, singletonConn, region, metadata, expiresIn },
    [
      { key: 'key', type: 'string', required: true },
      { key: 'bucket', type: 'string', required: true },
      { key: 'singletonConn', type: 'string', required: true },
      { key: 'region', type: 'string', required: true },
      { key: 'metadata', type: 'object', required: false },
      { key: 'expiresIn', type: 'number', required: true },
    ]
  );

  return getUploadSignedUrlService(input.key, input.bucket, {
    singletonConn: input.singletonConn,
    region: input.region,
    metadata: input.metadata,
    expiresIn: input.expiresIn,
  });
};

export default getUploadSignedUrl;
