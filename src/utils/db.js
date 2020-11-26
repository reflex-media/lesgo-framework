import config from 'Config/db'; // eslint-disable-line import/no-unresolved
import AuroraDbService from '../services/AuroraDbService';

const db = new AuroraDbService(config);

export default db;
