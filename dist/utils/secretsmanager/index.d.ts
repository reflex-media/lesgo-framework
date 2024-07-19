import getClient from './getClient';
import getSecretValue from './getSecretValue';
export { getClient, getSecretValue };
declare const _default: {
    getClient: ({ singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => import("@aws-sdk/client-s3").S3Client;
    getSecretValue: (secretId: string, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<any>;
};
export default _default;
