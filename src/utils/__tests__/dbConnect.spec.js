import dbConfig from 'Config/database'; // eslint-disable-line import/no-unresolved
import * as dbConnect from '../dbConnect';

describe('UtilsGroup: test dbConnect utils', () => {
  it('test connectWriteDb with default config', () => {
    const {
      host,
      port,
      database,
      user,
      password,
    } = dbConfig.connections.mysql.connection;

    expect(dbConnect.connectWriteDb().mysql.getConfig()).toMatchObject({
      host,
      port,
      database,
      user,
      password,
    });
  });

  it('test connectWriteDb with specified driver', () => {
    const {
      host,
      port,
      database,
      user,
      password,
    } = dbConfig.connections.mysql.connection;

    expect(dbConnect.connectWriteDb('mysql').mysql.getConfig()).toMatchObject({
      host,
      port,
      database,
      user,
      password,
    });
  });

  it('test connectReadDb with default config', () => {
    const {
      host_read: hostRead,
      port,
      database,
      user,
      password,
    } = dbConfig.connections.mysql.connection;

    expect(dbConnect.connectReadDb().mysql.getConfig()).toMatchObject({
      host: hostRead,
      port,
      database,
      user,
      password,
    });
  });

  it('test connectReadDb with mysql config', () => {
    const {
      host_read: hostRead,
      port,
      database,
      user,
      password,
    } = dbConfig.connections.mysql.connection;

    expect(dbConnect.connectReadDb('mysql').mysql.getConfig()).toMatchObject({
      host: hostRead,
      port,
      database,
      user,
      password,
    });
  });
});
