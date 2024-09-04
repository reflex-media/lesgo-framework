import appConfig from './app';
import awsConfig from './aws';

const dynamodbTableAliases =
  process.env.LESGO_AWS_DYNAMODB_TABLE_ALIASES?.split(',') || [];

export default {
  region: process.env.LESGO_AWS_DYNAMODB_REGION || awsConfig.region,
  tables: dynamodbTableAliases.map(t => ({
    alias: t,
    name: `${appConfig.stackName}-${t}`,
  })),
};
