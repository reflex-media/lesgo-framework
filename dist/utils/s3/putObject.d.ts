/// <reference types="node" />
import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
declare const putObject: (key: string, file: Buffer | Uint8Array | Blob | string, opts?: PutObjectCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
