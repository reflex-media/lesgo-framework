import { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { GetSignedUrlOptions } from '../../services/S3Service/getUploadSignedUrl';
import { ClientOptions } from '../../types/aws';
declare const getUploadSignedUrl: (key: string, opts?: GetObjectCommandInput, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getUploadSignedUrl;
