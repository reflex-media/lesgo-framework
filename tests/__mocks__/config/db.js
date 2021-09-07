export default {
  // these are legacy db connections
  secretArn: 'secretArn',
  secretCommandArn: 'secretCommandArn',
  resourceArn: 'resourceArn',
  database: 'database',
  // use the below for the latest db connections
  default: 'dataApi',
  connections: {
    dataApi: {
      secretArn: 'secretArn',
      secretCommandArn: 'secretCommandArn',
      resourceArn: 'resourceArn',
      database: 'database',
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
