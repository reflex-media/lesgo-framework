import { GetSignedUrlOptions } from '../../services/S3Service/getUploadSignedUrl';
import { ClientOptions } from '../../types/aws';
import { PutObjectOptions } from '../../services/S3Service/putObject';
declare const getUploadSignedUrl: (key: string, opts?: PutObjectOptions, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getUploadSignedUrl;
