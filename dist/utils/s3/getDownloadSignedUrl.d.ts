declare const getDownloadSignedUrl: (key: string, bucket: string, { singletonConn, region, expiresIn }?: {
    singletonConn?: string;
    region?: string;
    expiresIn?: number;
}) => Promise<string>;
export default getDownloadSignedUrl;
