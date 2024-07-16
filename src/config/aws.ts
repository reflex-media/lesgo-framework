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
};
