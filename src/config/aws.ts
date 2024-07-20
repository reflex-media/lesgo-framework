const sqsQueueAliases =
  process.env.LESGO_AWS_SQS_QUEUE_ALIASES?.split(',') || [];
const sqsRegion =
  process.env.LESGO_AWS_SQS_REGION ||
  process.env.LESGO_AWS_REGION ||
  process.env.AWS_ACCOUNT_REGION ||
  'ap-southeast-1';

const dynamodbTableAliases =
  process.env.LESGO_AWS_DYNAMODB_TABLE_ALIASES?.split(',') || [];

export default {
  region:
    process.env.LESGO_AWS_REGION ||
    process.env.AWS_ACCOUNT_REGION ||
    'ap-southeast-1',
  s3: {
    bucket: process.env.LESGO_AWS_S3_BUCKET || 'lesgo-dev',
    region:
      process.env.LESGO_AWS_S3_REGION ||
      process.env.LESGO_AWS_REGION ||
      process.env.AWS_ACCOUNT_REGION ||
      'ap-southeast-1',
  },
  sqs: {
    region: sqsRegion,
    queues: sqsQueueAliases.map(q => ({
      alias: q,
      name: `${process.env.APP_NAME}-${process.env.APP_ENV}-${q}`,
      url: `https://sqs.${sqsRegion}.amazonaws.com/${
        process.env.AWS_ACCOUNT_ID
      }/${`${process.env.APP_NAME}-${process.env.APP_ENV}-${q}`}`,
    })),
  },
  dynamodb: {
    region:
      process.env.LESGO_AWS_DYNAMODB_REGION ||
      process.env.LESGO_AWS_REGION ||
      process.env.AWS_ACCOUNT_REGION ||
      'ap-southeast-1',
    tables: dynamodbTableAliases.map(t => ({
      alias: t,
      name: `${process.env.APP_NAME}-${process.env.APP_ENV}-${t}`,
    })),
  },
  rds: {
    aurora: {
      mysql: {
        region:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_REGION ||
          process.env.LESGO_AWS_REGION ||
          process.env.AWS_ACCOUNT_REGION ||
          'ap-southeast-1',
        secretArn:
          process.env.LESGO_AWS_RDS_AURORA_MYSQL_SECRETS_MANAGER_DB_SECRET_ARN,
        resourceArn: process.env.LESGO_AWS_RDS_AURORA_MYSQL_RESOURCE_ARN,
        databaseName: process.env.LESGO_AWS_RDS_AURORA_MYSQL_DB_NAME,
        databaseCredentialsSecretsManagerSecretId:
          process.env
            .LESGO_AWS_SECRETS_MANAGER_RDS_AURORA_MYSQL_DB_CREDENTIALS_SECRET_ID,
      },
    },
  },
  secretsManager: {
    region:
      process.env.LESGO_AWS_SECRETS_MANAGER_REGION ||
      process.env.LESGO_AWS_REGION ||
      process.env.AWS_ACCOUNT_REGION ||
      'ap-southeast-1',
  },
};
