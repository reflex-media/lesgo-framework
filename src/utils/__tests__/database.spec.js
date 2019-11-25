import db from '../database';

// TODO we'll need to add more expected response from knex.js

describe('UtilsGroup: test database utils', () => {
  it('test select query', async () => {
    await expect(db().query.raw('SELECT * FROM users1')).resolves.toMatchObject(
      {
        data: {},
        mocked: {
          query: 'SELECT * FROM users1',
        },
      }
    );

    // test singleton instance
    await expect(db().query.raw('SELECT * FROM users2')).resolves.toMatchObject(
      {
        mocked: {
          query: 'SELECT * FROM users2',
        },
      }
    );
  });
});
