import { S3Client } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
declare const getClient: (clientOpts?: ClientOptions) => S3Client;
export default getClient;
