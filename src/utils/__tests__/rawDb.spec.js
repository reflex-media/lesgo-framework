import dbConfig from 'Config/database'; // eslint-disable-line import/no-unresolved
import { internalMethods } from '../rawDb';

describe('UtilsGroup: test rawDb utils', () => {
  it('test connectWriteDb with default config', () => {
    expect(internalMethods.connectWriteDb().db.getConfig()).toMatchObject(
      dbConfig.connections.mysql.connection
    );
  });

  it('test connectWriteDb with specified driver', () => {
    expect(
      internalMethods.connectWriteDb('mysql').db.getConfig()
    ).toMatchObject(dbConfig.connections.mysql.connection);
  });

  it('test connectReadDb with default config', () => {
    expect(internalMethods.connectReadDb().db.getConfig()).toMatchObject({
      ...dbConfig.connections.mysql.connection,
      host: dbConfig.connections.mysql.connection.host_read,
    });
  });

  it('test connectReadDb with mysql config', () => {
    expect(internalMethods.connectReadDb('mysql').db.getConfig()).toMatchObject(
      {
        ...dbConfig.connections.mysql.connection,
        host: dbConfig.connections.mysql.connection.host_read,
      }
    );
  });
});
