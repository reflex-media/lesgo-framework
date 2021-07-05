import config from 'Config/db'; // eslint-disable-line import/no-unresolved
import AuroraDbRDSProxyService from '../services/AuroraDbRDSProxyService';
import AuroraDbService from '../services/AuroraDbService';

/* eslint-disable-next-line import/no-mutable-exports */
let db;

/**
 * For a more file size optimized approach,
 * create your own src/utils/db.js and import only
 * the specific Service.
 */
if (config.connectionType === 'rds-proxy') {
  db = new AuroraDbRDSProxyService(config);
} else {
  db = new AuroraDbService(config);
}

export default db;
