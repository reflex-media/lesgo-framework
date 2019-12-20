import dbConfig from 'Config/database'; // eslint-disable-line import/no-unresolved
import { connectDb, db, dbRead } from '../db';
import * as dbConnect from '../dbConnect';

describe('UtilsGroup: test db utils', () => {
  it('test db', () => {
    const { host } = dbConfig.connections.mysql.connection;
    expect(db.mysql.getConfig()).toMatchObject({ host });
  });

  it('test dbRead', () => {
    const { host_read: hostRead } = dbConfig.connections.mysql.connection;
    expect(dbRead.mysql.getConfig()).toMatchObject({ host: hostRead });
  });

  it('test connectDb', () => {
    const connectWriteDbSpy = jest.spyOn(dbConnect, 'connectWriteDb');
    const connectReadDbSpy = jest.spyOn(dbConnect, 'connectReadDb');

    const result = connectDb();

    expect(connectWriteDbSpy).toHaveBeenCalledTimes(1);
    expect(connectReadDbSpy).toHaveBeenCalledTimes(1);

    expect(result).toBeUndefined();

    connectWriteDbSpy.mockRestore();
    connectReadDbSpy.mockRestore();
  });
});
