import { ClientOptions } from '../../types/aws';
declare const deleteRedisCache: (key: string, clientOpts?: ClientOptions) => Promise<number>;
export default deleteRedisCache;
