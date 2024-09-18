import awsConfig from './aws';
import { convertQueueAliasToObject } from '../utils/sqs';
import { Queue } from '../services/SQSService/getQueueUrl';

const sqsQueueAliases =
  process.env.LESGO_AWS_SQS_QUEUE_ALIASES?.split(',') || [];

export default {
  region: process.env.LESGO_AWS_SQS_REGION || awsConfig.region,
  queues: convertQueueAliasToObject(sqsQueueAliases) as Queue[],
};
