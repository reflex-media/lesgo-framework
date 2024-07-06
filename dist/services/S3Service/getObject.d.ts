export interface GetObjectOptions {
    region: string;
    singletonConn: string;
}
declare const getObject: (key: string, bucket: string, { region, singletonConn }: GetObjectOptions) => Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
export default getObject;
