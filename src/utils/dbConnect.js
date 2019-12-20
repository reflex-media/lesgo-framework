import config from 'Config/db'; // eslint-disable-line import/no-unresolved
import MySQLDbService from '../services/MySQLDbService';

const writeSingleton = [];
const readSingleton = [];

export const connectWriteDb = (conn = null) => {
  if (writeSingleton[conn]) {
    return writeSingleton[conn];
  }

  const dbconfig = config.connections[conn || config.default];
  const instance = new MySQLDbService();

  instance.connect(dbconfig.connection);

  writeSingleton[conn] = instance;

  return instance;
};

export const connectReadDb = (conn = null) => {
  if (readSingleton[conn]) {
    return readSingleton[conn];
  }

  const dbconfig = config.connections[conn || config.default];
  const { host, host_read: hostRead } = dbconfig.connection;

  if (hostRead && hostRead !== host) {
    const instance = new MySQLDbService();

    instance.connect({
      ...dbconfig.connection,
      host: hostRead,
    });

    readSingleton[conn] = instance;

    return instance;
  }

  return connectWriteDb(conn);
};
