import dbConfig from 'config/db'; // eslint-disable-line import/no-unresolved
import AuroraDbRDSProxyService from '../services/AuroraDbRDSProxyService';
import AuroraDbService from '../services/AuroraDbService';

/* eslint-disable-next-line import/no-mutable-exports */
let db;

if (dbConfig.default === 'rdsProxy' || dbConfig.default === 'rdsProxyRead') {
  db = new AuroraDbRDSProxyService(dbConfig.connections[dbConfig.default]);
} else if (dbConfig.default === 'dataApi') {
  db = new AuroraDbService(dbConfig.connections[dbConfig.default]);
} else {
  // @deprecated
  db = new AuroraDbService(dbConfig);
}

export default db;
