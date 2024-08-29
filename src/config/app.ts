const appName = process.env.APP_NAME || 'lesgo';
const env = process.env.APP_ENV || 'dev';
const stackName = `${appName}-${env}`;

export default {
  name: appName,
  stackName,
  env,
  debug: process.env.APP_DEBUG === 'true',
};
