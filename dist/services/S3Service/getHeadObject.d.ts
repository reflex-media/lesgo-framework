interface GetHeadObjectOptions {
    region: string;
    singletonConn: string;
}
declare const getHeadObject: (key: string, bucket: string, { region, singletonConn }: GetHeadObjectOptions) => Promise<{
    LastModified: Date | undefined;
    ContentLength: number | undefined;
    ETag: string | undefined;
    ContentType: string | undefined;
    Metadata: Record<string, string> | undefined;
}>;
export default getHeadObject;
