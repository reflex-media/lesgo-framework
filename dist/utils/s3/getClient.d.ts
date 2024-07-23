import { ClientOptions } from '../../types/aws';
declare const getClient: (clientOpts: ClientOptions) => import("@aws-sdk/client-s3").S3Client;
export default getClient;
