import { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export interface GetSignedUrlOptions {
    expiresIn?: number;
}
declare const getDownloadSignedUrl: (key: string, opts?: GetObjectCommandInput, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getDownloadSignedUrl;
