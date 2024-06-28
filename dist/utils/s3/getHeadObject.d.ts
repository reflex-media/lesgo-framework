declare const getHeadObject: (key: string, bucket: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<{
    LastModified: Date | undefined;
    ContentLength: number | undefined;
    ETag: string | undefined;
    ContentType: string | undefined;
    Metadata: Record<string, string> | undefined;
}>;
export default getHeadObject;
