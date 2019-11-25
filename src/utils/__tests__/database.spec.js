import db from '../database';

// TODO we'll need to add more expected response from knex.js

describe('UtilsGroup: test database utils', () => {
  it('test select query', () => {
    return expect(db().query.raw('SELECT * FROM users')).resolves.toMatchObject(
      {
        data: {},
        mocked: {
          query: 'SELECT * FROM users',
        },
      }
    );
  });
});
