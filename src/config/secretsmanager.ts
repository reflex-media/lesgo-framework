import awsConfig from './aws';

export default {
  region: process.env.LESGO_AWS_SECRETS_MANAGER_REGION || awsConfig.region,
};
