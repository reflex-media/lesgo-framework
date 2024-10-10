import { Queue } from '../../services/SQSService/getQueueUrl';
import appConfig from '../../config/app';
import awsConfig from '../../config/aws';

const convert = (queueAlias: string): Queue => ({
  alias: queueAlias,
  name: `${appConfig.stackName}-${queueAlias}`,
  url: `https://sqs.${awsConfig.region}.amazonaws.com/${
    awsConfig.accountId
  }/${`${appConfig.stackName}-${queueAlias}`}`,
});

export const convertQueueAliasToObject = (queueAlias: string | string[]) => {
  if (Array.isArray(queueAlias)) {
    return queueAlias.map(q => convert(q));
  }

  return convert(queueAlias);
};

export default convertQueueAliasToObject;
