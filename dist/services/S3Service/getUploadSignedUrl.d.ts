export interface GetUploadSignedUrlOptions {
    singletonConn: string;
    region: string;
    expiresIn: number;
    metadata?: {
        [key: string]: string;
    };
}
declare const getUploadSignedUrl: (key: string, bucket: string, { singletonConn, region, expiresIn, metadata }: GetUploadSignedUrlOptions) => Promise<string>;
export default getUploadSignedUrl;
