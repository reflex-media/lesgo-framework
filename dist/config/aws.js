var _a;
const sqsQueueNames =
  ((_a = process.env.LESGO_AWS_SQS_QUEUE_NAMES) === null || _a === void 0
    ? void 0
    : _a.split(',')) || [];
const sqsRegion =
  process.env.LESGO_AWS_SQS_REGION ||
  process.env.LESGO_AWS_REGION ||
  process.env.AWS_ACCOUNT_REGION ||
  'ap-southeast-1';
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
    queues: sqsQueueNames.map(q => ({
      alias: q,
      name: `${process.env.APP_NAME}-${process.env.APP_ENV}-${q}`,
      url: `https://sqs.${sqsRegion}.amazonaws.com/${
        process.env.AWS_ACCOUNT_ID
      }/${`${process.env.APP_NAME}-${process.env.APP_ENV}-${q}`}`,
    })),
  },
};
