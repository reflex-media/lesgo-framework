export default {
  accountId: process.env.AWS_ACCOUNT_ID,
  region:
    process.env.LESGO_AWS_REGION ||
    process.env.AWS_ACCOUNT_REGION ||
    'ap-southeast-1',
};
