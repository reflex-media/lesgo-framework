import { PutObjectOptions } from '../../services/S3Service/putObject';
import { ClientOptions } from '../../types/aws';
declare const putObject: (key: string, file: Buffer | Uint8Array | Blob | string, opts?: PutObjectOptions, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
export default putObject;
