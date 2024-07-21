var _a;
import awsConfig from './aws';
import appConfig from './app';
const sqsQueueAliases =
  ((_a = process.env.LESGO_AWS_SQS_QUEUE_ALIASES) === null || _a === void 0
    ? void 0
    : _a.split(',')) || [];
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
