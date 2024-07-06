export default {
  region:
    process.env.AWS_ACCOUNT_REGION ||
    process.env.LESGO_AWS_REGION ||
    'ap-southeast-1',
};
