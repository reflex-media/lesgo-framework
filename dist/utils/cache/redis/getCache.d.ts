import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';
declare const getCache: (key: string, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<string | null>;
export default getCache;
