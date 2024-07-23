import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export interface GetSignedUrlOptions {
    expiresIn?: number;
}
declare const getUploadSignedUrl: (key: string, opts?: PutObjectCommandInput, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getUploadSignedUrl;
