import awsConfig from './aws';
import appConfig from './app';

const sqsQueueAliases =
  process.env.LESGO_AWS_SQS_QUEUE_ALIASES?.split(',') || [];

const region = process.env.LESGO_AWS_SQS_REGION || awsConfig.region;

export default {
  region: process.env.LESGO_AWS_SQS_REGION || awsConfig.region,
  queues: sqsQueueAliases.map(q => ({
    alias: q,
    name: `${appConfig.stackName}-${q}`,
    url: `https://sqs.${region}.amazonaws.com/${
      awsConfig.accountId
    }/${`${appConfig.stackName}-${q}`}`,
  })),
};
