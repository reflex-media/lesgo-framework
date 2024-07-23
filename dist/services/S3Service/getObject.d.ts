/// <reference types="node" />
import { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export declare const streamToBuffer: (stream?: any) => Promise<Buffer>;
declare const getObject: (key: string, opts?: GetObjectCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
export default getObject;
