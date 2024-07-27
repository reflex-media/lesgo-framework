import { ClientOptions } from '../../types/aws';
declare const getRedisCache: (key: string, clientOpts?: ClientOptions) => Promise<string | null>;
export default getRedisCache;
