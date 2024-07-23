/// <reference types="node" />
import getClient from './getClient';
import getDownloadSignedUrl from './getDownloadSignedUrl';
import getHeadObject from './getHeadObject';
import getObject from './getObject';
import getUploadSignedUrl from './getUploadSignedUrl';
import putObject from './putObject';
export { getClient, getDownloadSignedUrl, getHeadObject, getObject, getUploadSignedUrl, putObject, };
declare const _default: {
    getClient: (clientOpts?: import("../../types/aws").ClientOptions) => import("@aws-sdk/client-s3").S3Client;
    getDownloadSignedUrl: (key: string, opts?: import("./getObject").GetObjectOptions | undefined, signingOpts?: import("./getDownloadSignedUrl").GetSignedUrlOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<string>;
    getHeadObject: (key: string, opts?: import("./getHeadObject").HeadObjectOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<{
        LastModified: Date | undefined;
        ContentLength: number | undefined;
        ETag: string | undefined;
        ContentType: string | undefined;
        Metadata: Record<string, string> | undefined;
    }>;
    getObject: (key: string, opts?: import("./getObject").GetObjectOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    getUploadSignedUrl: (key: string, opts?: import("./putObject").PutObjectOptions | undefined, signingOpts?: import("./getUploadSignedUrl").GetSignedUrlOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<string>;
    putObject: (key: string, file: string | Uint8Array | Buffer | Blob, opts?: import("./putObject").PutObjectOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
};
export default _default;
