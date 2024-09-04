import getUploadSignedUrlService, {
  GetSignedUrlOptions,
} from '../../services/S3Service/getUploadSignedUrl';
import { ClientOptions } from '../../types/aws';
import { PutObjectOptions } from '../../services/S3Service/putObject';

const getUploadSignedUrl = async (
  key: string,
  opts?: PutObjectOptions,
  signingOpts?: GetSignedUrlOptions,
  clientOpts?: ClientOptions
) => {
  return getUploadSignedUrlService(key, opts, signingOpts, clientOpts);
};

export default getUploadSignedUrl;
