import awsConfig from './aws';
export default {
  aurora: {
    mysql: {
      region: process.env.LESGO_AWS_RDS_AURORA_MYSQL_REGION || awsConfig.region,
      databaseName: process.env.LESGO_AWS_RDS_AURORA_MYSQL_DB_NAME,
      proxy: {
        dbCredentialsSecretId:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_DB_CREDENTIALS_SECRET_ID,
      },
    },
  },
};
