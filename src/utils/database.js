import { database as config } from '../config';
import DatabaseService from '../services/DatabaseService';

const singleton = [];

const db = (conn = null) => {
  if (singleton[conn]) {
    return singleton[conn];
  }

  const instance = new DatabaseService({
    ...config.connections[conn || config.default],
  });

  singleton[conn] = instance;

  return instance;
};

export default db;
