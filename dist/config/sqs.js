var _a;
import awsConfig from './aws';
import { convertQueueAliasToObject } from '../utils/sqs';
const sqsQueueAliases =
  ((_a = process.env.LESGO_AWS_SQS_QUEUE_ALIASES) === null || _a === void 0
    ? void 0
    : _a.split(',')) || [];
export default {
  region: process.env.LESGO_AWS_SQS_REGION || awsConfig.region,
  queues: convertQueueAliasToObject(sqsQueueAliases),
};
