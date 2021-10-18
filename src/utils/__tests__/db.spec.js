import config from 'Config/db'; // eslint-disable-line import/no-unresolved

let db;

beforeEach(() => {
  jest.isolateModules(() => {
    db = require('../db').default; // eslint-disable-line global-require
  });
});

describe('test db utils instantiate', () => {
  it('should not throw error on instantiating AuroraDbService', () => {
    return expect(db).toMatchObject({
      client: {
        mocked: {
          database: config.database,
          resourceArn: config.resourceArn,
          secretArn: config.secretArn,
        },
      },
    });
  });

  it('should update AuroraDb credentials on connect', () => {
    db.connect({
      database: config.database,
      resourceArn: config.resourceArn,
      secretArn: config.secretCommandArn,
    });

    return expect(db.client).toMatchObject({
      mocked: {
        database: config.database,
        resourceArn: config.resourceArn,
        secretArn: config.secretCommandArn,
      },
    });
  });

  it('should update AuroraDb credentials on connect based on dataApi config', () => {
    config.default = 'dataApi';
    let thisDb;
    jest.isolateModules(() => {
      thisDb = require('../db').default; // eslint-disable-line global-require
    });

    return expect(thisDb.client).toMatchObject({
      mocked: {
        database: config.connections.dataApi.database,
        resourceArn: config.connections.dataApi.resourceArn,
        secretArn: config.connections.dataApi.secretArn,
      },
    });
  });

  it('should update AuroraDb credentials on connect based on rdsProxy config', () => {
    config.default = 'rdsProxy';
    let thisDb;
    jest.isolateModules(() => {
      thisDb = require('../db').default; // eslint-disable-line global-require
    });

    return expect(thisDb.clientOpts).toMatchObject({
      database: config.connections.rdsProxy.database,
      host: config.connections.rdsProxy.host,
      user: config.connections.rdsProxy.user,
      password: config.connections.rdsProxy.password,
      persists: config.connections.rdsProxy.persists,
    });
  });
});
