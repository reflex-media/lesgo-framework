import { HeadObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export interface GetHeadObjectOptions {
    region: string;
    singletonConn: string;
}
declare const getHeadObject: (key: string, opts?: HeadObjectCommandInput, clientOpts?: ClientOptions) => Promise<import("@aws-sdk/client-s3").HeadObjectCommandOutput>;
export default getHeadObject;
