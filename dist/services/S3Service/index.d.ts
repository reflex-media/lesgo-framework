/// <reference types="node" />
import getClient from './getClient';
import getDownloadSignedUrl from './getDownloadSignedUrl';
import getHeadObject from './getHeadObject';
import getObject from './getObject';
import getUploadSignedUrl from './getUploadSignedUrl';
import putObject from './putObject';
export { getClient, getDownloadSignedUrl, getHeadObject, getObject, getUploadSignedUrl, putObject, };
declare const _default: {
    getClient: ({ region, singletonConn }: import("./getClient").GetClientOptions) => import("@aws-sdk/client-s3").S3Client;
    getDownloadSignedUrl: (key: string, bucket: string, { singletonConn, region, expiresIn }: import("./getDownloadSignedUrl").GetDownloadSignedUrlOptions) => Promise<string>;
    getHeadObject: (key: string, bucket: string, { region, singletonConn }: import("./getHeadObject").GetHeadObjectOptions) => Promise<{
        LastModified: Date | undefined;
        ContentLength: number | undefined;
        ETag: string | undefined;
        ContentType: string | undefined;
        Metadata: Record<string, string> | undefined;
    }>;
    getObject: (key: string, bucket: string, { region, singletonConn }: import("./getObject").GetObjectOptions) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    getUploadSignedUrl: (key: string, bucket: string, { singletonConn, region, expiresIn, metadata }: import("./getUploadSignedUrl").GetUploadSignedUrlOptions) => Promise<string>;
    putObject: (key: string, bucket: string, file: string | Uint8Array | Buffer | Blob, { region, singletonConn, storageClass }: import("./putObject").PutObjectOptions) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
};
export default _default;
