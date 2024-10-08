import { ConnectionOptions } from 'mysql2/promise';
import getClientService from '../../../../services/RDSAuroraMySQLProxyService/getMySQLProxyClient';
import { RDSAuroraMySQLProxyClientOptions } from '../../../../types/aws';

const getClient = (
  connOptions?: ConnectionOptions,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  return getClientService(connOptions, clientOpts);
};

export default getClient;
