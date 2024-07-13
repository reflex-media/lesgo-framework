export default {
  region:
    process.env.LESGO_AWS_REGION ||
    process.env.AWS_ACCOUNT_REGION ||
    'ap-southeast-1',
  s3: {
    bucket: process.env.LESGO_AWS_S3_BUCKET || 'lesgo-dev',
    region:
      process.env.LESGO_AWS_S3_REGION ||
      process.env.LESGO_AWS_REGION ||
      process.env.AWS_ACCOUNT_REGION ||
      'ap-southeast-1',
  },
};
