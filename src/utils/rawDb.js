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
  if (dbconfig.connection.host_read !== dbconfig.connection.host) {
    const instance = new MySQLDbService();

    instance.config({
      ...dbconfig.connection,
      host: dbconfig.connection.host_read,
    });

    readSingleton[conn] = instance;

    return instance;
  }

  return connectWriteDb(conn);
};

export const connectDb = (conn = null) => {
  connectWriteDb(conn);
  connectReadDb(conn);
};

export const db = connectWriteDb();

export const dbRead = connectReadDb();
