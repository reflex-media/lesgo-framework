import { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { GetSignedUrlOptions } from '../../services/S3Service/getDownloadSignedUrl';
import { ClientOptions } from '../../types/aws';
declare const getDownloadSignedUrl: (key: string, opts?: GetObjectCommandInput, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getDownloadSignedUrl;
