import getDownloadSignedUrlService, {
  GetSignedUrlOptions,
} from '../../services/S3Service/getDownloadSignedUrl';
import { GetObjectOptions } from '../../services/S3Service/getObject';
import { ClientOptions } from '../../types/aws';

const getDownloadSignedUrl = async (
  key: string,
  opts?: GetObjectOptions,
  signingOpts?: GetSignedUrlOptions,
  clientOpts?: ClientOptions
) => {
  return getDownloadSignedUrlService(key, opts, signingOpts, clientOpts);
};

export default getDownloadSignedUrl;
