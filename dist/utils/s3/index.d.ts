/// <reference types="node" />
import getClient from './getClient';
import getObject from './getObject';
import getHeadObject from './getHeadObject';
import getDownloadSignedUrl from './getDownloadSignedUrl';
import getUploadSignedUrl from './getUploadSignedUrl';
import putObject from './putObject';
export { getClient, getObject, getHeadObject, getDownloadSignedUrl, getUploadSignedUrl, putObject, };
declare const _default: {
    getClient: (clientOpts: import("../../types/aws").ClientOptions) => import("@aws-sdk/client-s3").S3Client;
    getObject: (key: string, opts?: import("@aws-sdk/client-s3").GetObjectCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<Buffer>;
    getHeadObject: (key: string, opts?: import("@aws-sdk/client-s3").HeadObjectCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<{
        LastModified: Date | undefined;
        ContentLength: number | undefined;
        ETag: string | undefined;
        ContentType: string | undefined;
        Metadata: Record<string, string> | undefined;
    }>;
    getDownloadSignedUrl: (key: string, opts?: import("@aws-sdk/client-s3").GetObjectCommandInput | undefined, signingOpts?: import("../../services/S3Service/getDownloadSignedUrl").GetSignedUrlOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<string>;
    getUploadSignedUrl: (key: string, opts?: import("@aws-sdk/client-s3").GetObjectCommandInput | undefined, signingOpts?: import("../../services/S3Service/getUploadSignedUrl").GetSignedUrlOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<string>;
    putObject: (key: string, file: string | Uint8Array | Buffer | Blob, opts?: import("@aws-sdk/client-s3").PutObjectCommandInput | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
};
export default _default;
