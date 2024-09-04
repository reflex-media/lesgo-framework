/// <reference types="node" />
import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export interface PutObjectOptions extends Partial<Omit<PutObjectCommandInput, 'Key' | 'Bucket'>> {
    Key?: string;
    Bucket?: string;
}
declare const putObject: (key: string, file: Buffer | Uint8Array | Blob | string, opts?: PutObjectOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
