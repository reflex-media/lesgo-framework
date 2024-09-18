import appConfig from '../../config/app';
import awsConfig from '../../config/aws';
const convert = queueAlias => ({
  alias: queueAlias,
  name: `${appConfig.stackName}-${queueAlias}`,
  url: `https://sqs.${awsConfig.region}.amazonaws.com/${
    awsConfig.accountId
  }/${`${appConfig.stackName}-${queueAlias}`}`,
});
export default queueAlias => {
  if (Array.isArray(queueAlias)) {
    return queueAlias.map(q => convert(q));
  }
  return convert(queueAlias);
};
