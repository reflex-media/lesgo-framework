import { Queue } from '../../services/SQSService/getQueueUrl';
import appConfig from '../../config/app';
import awsConfig from '../../config/aws';

const convert = (queueAlias: string) =>
  ({
    alias: queueAlias,
    name: `${appConfig.stackName}-${queueAlias}`,
    url: `https://sqs.${awsConfig.region}.amazonaws.com/${
      awsConfig.accountId
    }/${`${appConfig.stackName}-${queueAlias}`}`,
  } as Queue);

export default (queueAlias: string | string[]) => {
  if (Array.isArray(queueAlias)) {
    return queueAlias.map(q => convert(q));
  }

  return convert(queueAlias);
};
