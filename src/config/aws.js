export default {
  sqs: {
    options: {
      accessKeyId: process.env.AWS_SQS_OPTIONS_ACCESS_KEY_ID || null,
      secretAccessKey: process.env.AWS_SQS_OPTIONS_SECRET_ACCESS_KEY || null,
      region: process.env.AWS_SQS_OPTIONS_REGION || null,
    },
    queues: {
      pingQueue: {
        name: `lesgo-${process.env.APP_ENV}-pingQueue`,
        url: `https://sqs.${process.env.AWS_ACCOUNT_REGION}.amazonaws.com/${
          process.env.AWS_ACCOUNT_ID
        }/${`lesgo-${process.env.APP_ENV}-pingQueue`}`,
      },
    },
  },
};
