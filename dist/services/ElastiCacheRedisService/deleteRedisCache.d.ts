import { ClientOptions } from '../../types/aws';
declare const deleteRedisCache: (keys: string | string[], clientOpts?: ClientOptions) => Promise<void>;
export default deleteRedisCache;
