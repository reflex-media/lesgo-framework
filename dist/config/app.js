const appName = process.env.LESGO_APP_NAME || process.env.APP_NAME || 'lesgo';
const env = process.env.LESGO_APP_ENV || process.env.APP_ENV || 'dev';
const stackName = `${appName}-${env}`;
export default {
  name: appName,
  stackName,
  env,
  debug:
    process.env.LESGO_APP_DEBUG === 'true' || process.env.APP_DEBUG === 'true',
};
