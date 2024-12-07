import awsConfig from './aws';

export default {
  aurora: {
    mysql: {
      region: process.env.LESGO_AWS_RDS_AURORA_MYSQL_REGION || awsConfig.region,
      databaseName: process.env.LESGO_AWS_RDS_AURORA_MYSQL_DB_NAME,
      proxy: {
        dbCredentialsSecretId:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_DB_CREDENTIALS_SECRET_ID,
        host: process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_HOST,
        port: process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_PORT,
        connectionLimit: Number(
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_CONNECTION_LIMIT || '10'
        ),
        waitForConnections:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_WAIT_FOR_CONNECTIONS ===
          'true',
        queueLimit: Number(
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_PROXY_QUEUE_LIMIT || '0'
        ),
      },
    },
  },
};
