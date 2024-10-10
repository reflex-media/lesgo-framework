var _a;
import awsConfig from './aws';
export default {
  region: process.env.LESGO_AWS_SQS_REGION || awsConfig.region,
  queueAliases:
    ((_a = process.env.LESGO_AWS_SQS_QUEUE_ALIASES) === null || _a === void 0
      ? void 0
      : _a.split(',')) || [],
};
