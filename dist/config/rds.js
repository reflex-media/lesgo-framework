import awsConfig from './aws';
export default {
  aurora: {
    mysql: {
      region: process.env.LESGO_AWS_RDS_AURORA_MYSQL_REGION || awsConfig.region,
      databaseName: process.env.LESGO_AWS_RDS_AURORA_MYSQL_DB_NAME,
      connectionType:
        process.env.LESGO_AWS_RDS_AURORA_MYSQL_CONNECTION_TYPE || 'proxy',
      dataApi: {
        secretArn: process.env.LESGO_AWS_RDS_AURORA_MYSQL_DATA_API_SECRET_ARN,
        resourceArn:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_DATA_API_RESOURCE_ARN,
        maxAttempts:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_DATA_API_MAX_ATTEMPTS || 3,
        requestTimeout:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_DATA_API_REQUEST_TIMEOUT ||
          30000,
      },
      proxy: {
        dbCredentialsSecretId:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_DB_CREDENTIALS_SECRET_ID,
      },
    },
  },
};
