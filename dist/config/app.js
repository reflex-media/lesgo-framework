export default {
  name: process.env.LESGO_APP_NAME || process.env.APP_NAME || 'lesgo',
  env: process.env.LESGO_APP_ENV || process.env.APP_ENV || 'dev',
  debug:
    process.env.LESGO_APP_DEBUG === 'true' || process.env.APP_DEBUG === 'true',
};
