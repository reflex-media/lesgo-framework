import { ClientOptions } from '../../types/aws';
import { PutObjectOptions } from './putObject';
export interface GetSignedUrlOptions {
    expiresIn?: number;
}
declare const getUploadSignedUrl: (key: string, opts?: PutObjectOptions, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getUploadSignedUrl;
