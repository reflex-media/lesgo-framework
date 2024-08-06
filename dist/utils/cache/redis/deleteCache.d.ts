import { ClientOptions } from '../../../types/aws';
declare const getCache: (key: string, clientOpts?: ClientOptions) => Promise<number>;
export default getCache;
