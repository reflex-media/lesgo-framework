import config from 'Config/database'; // eslint-disable-line import/no-unresolved
import MySQLDbService from '../MySQLDbService';

describe('ServicesGroup: test MySQLDbService', () => {
  it('test instantiate default MySQLDbService', () => {
    const mydb = new MySQLDbService();
    expect(mydb.db.getConfig()).toMatchObject({});
  });

  it('test instantiate MySQLDbService with options', () => {
    const options = config.connections.mysql;
    const { database, host, user, password } = options.connection;

    const mydb = new MySQLDbService(options);

    expect(mydb.db.getConfig()).toMatchObject({
      database,
      host,
      user,
      password,
    });
  });

  it('test connect MySQLDbService instance', () => {
    const options = config.connections.mysql;
    const { database, host, user, password } = options.connection;

    const mydb = new MySQLDbService();
    mydb.connect(options);

    expect(mydb.db.getConfig()).toMatchObject({
      database,
      host,
      user,
      password,
    });
  });
});
