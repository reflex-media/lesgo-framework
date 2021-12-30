export default {
  // these are legacy db connections
  secretArn: 'secretArn',
  secretCommandArn: 'secretCommandArn',
  resourceArn: 'resourceArn',
  database: 'database',
  // use the below for the latest db connections
  default: 'legacy',
  connections: {
    dataApi: {
      secretArn: 'secretArnDataApi',
      secretCommandArn: 'secretCommandArnDataApi',
      resourceArn: 'resourceArnDataApi',
      database: 'databaseDataApi',
    },
    rdsProxy: {
      host: 'some-fake-host',
      user: 'someFakeUser',
      password: 'someFakePassword',
      database: 'database',
      persists: true,
    },
    rdsProxyRead: {
      host: 'some-fake-host',
      user: 'someFakeUser',
      password: 'someFakePassword',
      database: 'database',
      persists: false,
    },
  },
};
