import { HeadObjectCommandInput } from '@aws-sdk/client-s3';
import { ClientOptions } from '../../types/aws';
export type HeadObjectOptions = Omit<HeadObjectCommandInput, 'Key'> & {
    Key?: string;
};
declare const getHeadObject: (key: string, opts?: HeadObjectOptions, clientOpts?: ClientOptions) => Promise<{
    LastModified: Date | undefined;
    ContentLength: number | undefined;
    ETag: string | undefined;
    ContentType: string | undefined;
    Metadata: Record<string, string> | undefined;
}>;
export default getHeadObject;
