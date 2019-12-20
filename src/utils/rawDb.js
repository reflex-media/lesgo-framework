import config from 'Config/database'; // eslint-disable-line import/no-unresolved
import MySQLDbService from '../services/MySQLDbService';

const writeSingleton = [];
const readSingleton = [];

const connectWriteDb = (conn = null) => {
  if (writeSingleton[conn]) {
    return writeSingleton[conn];
  }

  const dbconfig = config.connections[conn || config.default];
  const instance = new MySQLDbService();

  instance.config(dbconfig.connection);

  writeSingleton[conn] = instance;

  return instance;
};

const connectReadDb = (conn = null) => {
  if (readSingleton[conn]) {
    return readSingleton[conn];
  }

  const dbconfig = config.connections[conn || config.default];
  const { host, host_read: hostRead } = dbconfig.connection;

  if (hostRead && hostRead !== host) {
    const instance = new MySQLDbService();

    instance.config({
      ...dbconfig.connection,
      host: hostRead,
    });

    readSingleton[conn] = instance;

    return instance;
  }

  return connectWriteDb(conn);
};

const connectDb = (conn = null) => {
  connectWriteDb(conn);
  connectReadDb(conn);
};

const db = connectWriteDb();

const dbRead = connectReadDb();

export const internalMethods = {
  connectWriteDb,
  connectReadDb,
};

export { db, dbRead, connectDb };
