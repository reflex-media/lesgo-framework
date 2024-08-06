import { ClientOptions } from '../../../types/aws';
declare const getClient: (clientOpts?: ClientOptions) => Promise<import("ioredis/built/cluster").default>;
export default getClient;
