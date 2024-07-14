/// <reference types="node" />
export interface GetObjectOptions {
    region: string;
    singletonConn: string;
}
declare const getObject: (key: string, bucket: string, { region, singletonConn }: GetObjectOptions) => Promise<Buffer>;
export default getObject;
