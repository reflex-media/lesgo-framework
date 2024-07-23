import { HeadObjectOptions } from '../../services/S3Service/getHeadObject';
import { ClientOptions } from '../../types/aws';
declare const getHeadObject: (key: string, opts?: HeadObjectOptions, clientOpts?: ClientOptions) => Promise<{
    LastModified: Date | undefined;
    ContentLength: number | undefined;
    ETag: string | undefined;
    ContentType: string | undefined;
    Metadata: Record<string, string> | undefined;
}>;
export default getHeadObject;
