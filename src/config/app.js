export default {
  env: process.env.APP_ENV || process.env.NODE_ENV,
  debug: process.env.APP_DEBUG === 'true',
};
