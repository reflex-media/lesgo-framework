import dbConfig from 'config/db';
import mysql from 'mysql2/promise';
import isEmpty from '../../utils/isEmpty';
import logger from '../../utils/logger';
import LesgoException from '../../exceptions/LesgoException';
import validateFields from '../../utils/validateFields';

const FILE = 'services/AuroraDbRDSProxyService/connect';
const defaultDbConfig = dbConfig.connections[dbConfig.default] || {};

let singletonConn = null;

const validateOpts = opts => {
  const validFields = [
    { key: 'host', type: 'string', required: true },
    { key: 'user', type: 'string', required: true },
    { key: 'password', type: 'string', required: true },
    { key: 'database', type: 'string', required: true },
    { key: 'persists', type: 'boolean', required: false },
  ];

  try {
    return validateFields(opts, validFields);
  } catch (err) {
    throw new LesgoException(
      err.message,
      `${FILE}::FIELD_VALIDATION_EXCEPTION`,
      500,
      {
        ...opts,
        err,
      }
    );
  }
};

const connect = async (connectionOpts = {}) => {
  if (!isEmpty(singletonConn)) {
    logger.debug(`${FILE}::REUSE_CLIENT_SINGLETON`);
    return singletonConn;
  }

  let client;
  const validatedConnectionOpts = validateOpts({
    ...defaultDbConfig,
    ...connectionOpts,
  });
  const persistentConn = validatedConnectionOpts.persists;
  const clientOpts = {
    host: validatedConnectionOpts.host,
    user: validatedConnectionOpts.user,
    password: validatedConnectionOpts.password,
    database: validatedConnectionOpts.database,
    namedPlaceholders: true,
  };

  logger.debug(`${FILE}::PREPARING DB CONNECTION`, {
    clientOpts,
    persistentConn,
  });

  try {
    client = await mysql.createConnection(clientOpts);
  } catch (error) {
    throw new LesgoException(
      'Exception caught creating connection to MySQL',
      `${FILE}::MYSQL_CREATE_CONNECTION_EXCEPTION`,
      500,
      { error }
    );
  }

  if (persistentConn) {
    singletonConn = client;
    logger.debug(`${FILE}::NEW_CLIENT_SINGLETON`);
  }

  return client;
};

export const end = async (conn = {}) => {
  logger.debug(`${FILE}::ENDING DB CONNECTION`);

  if (!isEmpty(conn) && !!conn.end) {
    await conn.end();
    logger.debug(`${FILE}::DB DISCONNECTED`);
  } else {
    await singletonConn.end();
    singletonConn = null;
    logger.debug(`${FILE}::PERSISTED DB DISCONNECTED`);
  }
};

export default connect;
