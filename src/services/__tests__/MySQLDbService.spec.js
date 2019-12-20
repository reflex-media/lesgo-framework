import config from 'Config/db'; // eslint-disable-line import/no-unresolved
import MySQLDbService from '../MySQLDbService';

describe('ServicesGroup: test MySQLDbService', () => {
  it('test instantiate default MySQLDbService', () => {
    const mydb = new MySQLDbService();
    expect(mydb.mysql.getConfig()).toMatchObject({});
  });

  it('test instantiate MySQLDbService with options', () => {
    const options = config.connections.mysql;
    const { database, host, user, password } = options.connection;

    const mydb = new MySQLDbService(options);

    expect(mydb.mysql.getConfig()).toMatchObject({
      database,
      host,
      user,
      password,
    });
  });

  it('test connect MySQLDbService instance', () => {
    const dbConfig = config.connections.mysql.connection;
    const { database, host, user, password } = dbConfig;

    const mydb = new MySQLDbService();
    mydb.connect(dbConfig);

    expect(mydb.mysql.getConfig()).toMatchObject({
      database,
      host,
      user,
      password,
    });
  });
});
