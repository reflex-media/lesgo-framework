declare const getUploadSignedUrl: (key: string, bucket: string, { singletonConn, region, metadata, expiresIn, }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
    metadata?: undefined;
    expiresIn?: number | undefined;
}) => Promise<string>;
export default getUploadSignedUrl;
