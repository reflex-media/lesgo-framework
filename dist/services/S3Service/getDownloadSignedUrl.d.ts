import { ClientOptions } from '../../types/aws';
import { GetObjectOptions } from './getObject';
export interface GetSignedUrlOptions {
    expiresIn?: number;
}
declare const getDownloadSignedUrl: (key: string, opts?: GetObjectOptions, signingOpts?: GetSignedUrlOptions, clientOpts?: ClientOptions) => Promise<string>;
export default getDownloadSignedUrl;
