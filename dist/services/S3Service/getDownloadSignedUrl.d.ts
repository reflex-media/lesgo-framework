interface GetDownloadSignedUrlOptions {
    region: string;
    singletonConn: string;
    expiresIn: number;
}
declare const getDownloadSignedUrl: (key: string, bucket: string, { singletonConn, region, expiresIn }: GetDownloadSignedUrlOptions) => Promise<string>;
export default getDownloadSignedUrl;
