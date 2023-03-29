import config from 'config/aws'; // eslint-disable-line import/no-unresolved
import SQSService from '../services/SQSService';

const queue = new SQSService(config.sqs.options, config.sqs.queues);

const dispatch = (payload, queueName) => {
  return queue.dispatch(payload, queueName);
};

export { dispatch };
export default queue;
