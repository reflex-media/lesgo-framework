import config from 'Config/database'; // eslint-disable-line import/no-unresolved
import DatabaseService from '../DatabaseService';

describe('ServicesGroup: test DatabaseService', () => {
  it('test instantiate default DatabaseService', () => {
    const db = new DatabaseService(config.default);
    expect(db.options).toEqual('mysql');
  });
});
