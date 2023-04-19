import awsConfig from 'config/aws'; // eslint-disable-line import/no-unresolved
import sqsConfig from 'config/sqs'; // eslint-disable-line import/no-unresolved
import dispatch from '../../services/SQSService/dispatch';

export default (payload, queueName) => {
  return dispatch(payload, queueName, {
    region: awsConfig.region,
    queues: sqsConfig.queues,
  });
};
