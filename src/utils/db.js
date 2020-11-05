import config from 'Config/db'; // eslint-disable-line import/no-unresolved
import AuroraDbService from '../services/AuroraDbService';

const db = (opts = {}) => {
  const { secretArn, resourceArn, database } = opts;

  return new AuroraDbService(
    !secretArn ? secretArn : config.secretArn,
    !resourceArn ? resourceArn : config.resourceArn,
    !database ? database : config.database
  );
};

export default db;
