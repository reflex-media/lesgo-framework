import { RDSDataClient } from '@aws-sdk/client-rds-data';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
import awsConfig from '../../config/aws';
const FILE = 'lesgo.services.RDSAuroraMySQLDataAPIService.getClient';
const singleton = {};
const getClient = ({
  secretArn,
  resourceArn,
  databaseName,
  region,
  singletonConn,
}) => {
  const params = {
    secretArn: isEmpty(secretArn)
      ? awsConfig.rds.aurora.mysql.secretArn
      : secretArn,
    resourceArn: isEmpty(secretArn)
      ? awsConfig.rds.aurora.mysql.resourceArn
      : resourceArn,
    database: isEmpty(databaseName)
      ? awsConfig.rds.aurora.mysql.databaseName
      : secretArn,
  };
  if (!isEmpty(singleton[singletonConn])) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`, {
      params,
      region,
    });
    return {
      client: singleton[singletonConn],
      params,
    };
  }
  const client = new RDSDataClient({ region });
  singleton[singletonConn] = client;
  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    params,
    region,
  });
  return {
    client,
    params,
  };
};
export default getClient;
