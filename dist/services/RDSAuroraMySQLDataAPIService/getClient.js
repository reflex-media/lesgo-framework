var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import aws from 'aws-sdk';
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
}) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
  });
export default getClient;
