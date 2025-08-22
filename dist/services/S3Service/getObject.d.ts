import { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export interface GetObjectOptions extends Partial<Omit<GetObjectCommandInput, 'Key' | 'Bucket'>> {
    Key?: string;
    Bucket?: string;
}
export declare const streamToBuffer: (stream?: any) => Promise<Buffer>;
declare const getObject: (key: string, opts?: GetObjectOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
export default getObject;
