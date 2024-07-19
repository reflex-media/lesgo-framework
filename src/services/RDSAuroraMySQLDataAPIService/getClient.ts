import aws from 'aws-sdk';
import logger from '../../utils/logger';
import isEmpty from '../../utils/isEmpty';
import awsConfig from '../../config/aws';

const FILE = 'lesgo.services.RDSAuroraMySQLDataAPIService.getClient';

export interface Singleton {
  [key: string]: aws.RDSDataService;
}

export interface GetClientOptions {
  secretArn?: string;
  resourceArn?: string;
  databaseName?: string;
  region: string;
  singletonConn: string;
}

const singleton: Singleton = {};

const getClient = async ({
  secretArn,
  resourceArn,
  databaseName,
  region,
  singletonConn,
}: GetClientOptions) => {
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
  } as aws.RDSDataService.ExecuteStatementRequest;

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

  const rdsDataService = new aws.RDSDataService();

  singleton[singletonConn] = rdsDataService;
  logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`, {
    params,
    region,
  });

  return {
    client: rdsDataService,
    params,
  };
};

export default getClient;
