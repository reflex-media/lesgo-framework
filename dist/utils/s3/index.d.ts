/// <reference types="node" />
import getClient from './getClient';
import getObject from './getObject';
import getHeadObject from './getHeadObject';
import getDownloadSignedUrl from './getDownloadSignedUrl';
import getUploadSignedUrl from './getUploadSignedUrl';
import putObject from './putObject';
export { getClient, getObject, getHeadObject, getDownloadSignedUrl, getUploadSignedUrl, putObject, };
declare const _default: {
    getClient: ({ singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => import("@aws-sdk/client-s3").S3Client;
    getObject: (key: string, bucket: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    getHeadObject: (key: string, bucket: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<{
        LastModified: Date | undefined;
        ContentLength: number | undefined;
        ETag: string | undefined;
        ContentType: string | undefined;
        Metadata: Record<string, string> | undefined;
    }>;
    getDownloadSignedUrl: (key: string, bucket: string, { singletonConn, region, expiresIn }?: {
        singletonConn?: string;
        region?: string;
        expiresIn?: number;
    }) => Promise<string>;
    getUploadSignedUrl: (key: string, bucket: string, { singletonConn, region, metadata, expiresIn, }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
        metadata?: Record<string, string> | undefined;
        expiresIn?: number | undefined;
    }) => Promise<string>;
    putObject: (key: string, bucket: string, file: string | Uint8Array | Buffer | Blob, { singletonConn, region, storageClass }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
        storageClass?: string | undefined;
    }) => Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
};
export default _default;
