import {
  RDSDataClient,
  ExecuteStatementCommandInput,
} from '@aws-sdk/client-rds-data';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
import rdsConfig from '../../config/rds';

const FILE = 'lesgo.services.RDSAuroraMySQLDataAPIService.getClient';

export interface Singleton {
  [key: string]: RDSDataClient;
}

export interface GetClientOptions {
  secretArn?: string;
  resourceArn?: string;
  databaseName?: string;
  maxAttempts?: number;
  requestTimeout?: number;
  region: string;
  singletonConn: string;
}

const singleton: Singleton = {};

const getClient = ({
  secretArn,
  resourceArn,
  databaseName,
  maxAttempts,
  requestTimeout,
  region,
  singletonConn,
}: GetClientOptions) => {
  const params = {
    secretArn: isEmpty(secretArn)
      ? rdsConfig.aurora.mysql.dataApi.secretArn
      : secretArn,
    resourceArn: isEmpty(secretArn)
      ? rdsConfig.aurora.mysql.dataApi.resourceArn
      : resourceArn,
    database: isEmpty(databaseName)
      ? rdsConfig.aurora.mysql.databaseName
      : secretArn,
    maxAttempts: isEmpty(maxAttempts)
      ? rdsConfig.aurora.mysql.dataApi.maxAttempts
      : maxAttempts,
    requestTimeout: isEmpty(requestTimeout)
      ? rdsConfig.aurora.mysql.dataApi.requestTimeout
      : requestTimeout,
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

  const client = new RDSDataClient({ region, maxAttempts });

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
