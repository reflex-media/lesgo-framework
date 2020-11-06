import config from 'Config/db'; // eslint-disable-line import/no-unresolved
import db from '../db';

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
});
