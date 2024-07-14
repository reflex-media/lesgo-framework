/// <reference types="node" />
declare const getObject: (key: string, bucket?: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<Buffer>;
export default getObject;
