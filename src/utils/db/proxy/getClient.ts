import { PoolOptions } from 'mysql2/promise';
import getClientService from '../../../services/RDSAuroraMySQLProxyService/getClient';
import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';

const getClient = (
  poolOpts?: PoolOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  return getClientService(poolOpts, clientOpts);
};

export default getClient;
