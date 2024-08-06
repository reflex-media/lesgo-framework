import { ClientOptions } from '../../types/aws';
declare const getRedisCache: (key: string, clientOpts?: ClientOptions) => Promise<any>;
export default getRedisCache;
