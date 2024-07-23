/// <reference types="node" />
import { GetObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
declare const getObject: (key: string, opts?: GetObjectCommandInput, clientOpts?: ClientOptions) => Promise<Buffer>;
export default getObject;
