import awsConfig from './aws';

export default {
  region: process.env.LESGO_AWS_SQS_REGION || awsConfig.region,
  queueAliases: process.env.LESGO_AWS_SQS_QUEUE_ALIASES?.split(',') || [],
};
