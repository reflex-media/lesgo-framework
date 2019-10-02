import SQSService from '../services/SQSService';
import { aws } from '../config';

const queue = new SQSService(aws.sqs.options);

const dispatch = (payload, queueName) => {
  return queue.dispatch(payload, queueName);
};

export { dispatch };
export default queue;
