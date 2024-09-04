var _a;
import appConfig from './app';
import awsConfig from './aws';
const dynamodbTableAliases =
  ((_a = process.env.LESGO_AWS_DYNAMODB_TABLE_ALIASES) === null || _a === void 0
    ? void 0
    : _a.split(',')) || [];
export default {
  region: process.env.LESGO_AWS_DYNAMODB_REGION || awsConfig.region,
  tables: dynamodbTableAliases.map(t => ({
    alias: t,
    name: `${appConfig.stackName}-${t}`,
  })),
};
