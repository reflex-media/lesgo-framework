import SQSService from '../services/SQSService';
import { aws } from '../config';

const queue = new SQSService(aws.sqs.options, aws.sqs.queues);

export const dispatch = (payload, queueName) => {
  return queue.dispatch(payload, queueName);
};

export default queue;
