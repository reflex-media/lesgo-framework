import config from 'Config/aws'; // eslint-disable-line import/no-unresolved
import SNSService from '../services/SNSService';

const sns = new SNSService(config.sns.options);

const send = (toNumber, message, messageAttributes) => {
  return sns.sendSMS(toNumber, message, messageAttributes);
};

export { send };
export default sns;
