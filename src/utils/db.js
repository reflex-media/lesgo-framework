import dbConfig from 'config/db'; // eslint-disable-line import/no-unresolved
import * as AuroraDbRDSProxyService from '../services/AuroraDbRDSProxyService';
import AuroraDbService from '../services/AuroraDbService';

/* eslint-disable-next-line import/no-mutable-exports */
let db = AuroraDbRDSProxyService;

if (dbConfig.default === 'rdsProxy' || dbConfig.default === 'rdsProxyRead') {
  db = AuroraDbRDSProxyService;
} else if (dbConfig.default === 'dataApi') {
  db = new AuroraDbService(dbConfig.connections[dbConfig.default]);
} else {
  // @deprecated
  db = new AuroraDbService(dbConfig);
}

export default db;
