/// <reference types="node" />
import { GetObjectOptions } from '../../services/S3Service/getObject';
import { ClientOptions } from '../../types/aws';
declare const getObject: (key: string, opts?: GetObjectOptions, clientOpts?: ClientOptions) => Promise<Buffer>;
export default getObject;
