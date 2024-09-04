import awsConfig from './aws';

export default {
  region: process.env.LESGO_AWS_S3_REGION || awsConfig.region,
  bucket: process.env.LESGO_AWS_S3_BUCKET || 'lesgo-dev',
};
