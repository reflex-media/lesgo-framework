import config from 'Config/aws'; // eslint-disable-line import/no-unresolved
import SNSService from '../services/SNSService';

const sns = new SNSService(config.sns.options);

const notify = (targetArn, message, attributes) => {
  return sns.sendNotification(targetArn, message, attributes);
};

export { notify };
export default sns;
