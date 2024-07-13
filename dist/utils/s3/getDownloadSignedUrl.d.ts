declare const getDownloadSignedUrl: (key: string, bucket?: string, { singletonConn, region, expiresIn }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
    expiresIn?: number | undefined;
}) => Promise<string>;
export default getDownloadSignedUrl;
