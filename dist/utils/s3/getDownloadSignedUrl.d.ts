import { GetSignedUrlOptions } from '../../services/S3Service/getDownloadSignedUrl';
import { GetObjectOptions } from '../../services/S3Service/getObject';
import { ClientOptions } from '../../types/aws';
declare const getDownloadSignedUrl: (key: string, opts?: GetObjectOptions, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getDownloadSignedUrl;
