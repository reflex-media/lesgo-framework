declare const getClient: ({ singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<import("mysql2/promise").Pool>;
export default getClient;
