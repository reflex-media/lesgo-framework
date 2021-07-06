import mysql from 'mysql2/promise';
import logger from '../utils/logger';
import isEmpty from '../utils/isEmpty';
import LesgoException from '../exceptions/LesgoException';
import LengthAwarePaginator from './pagination/LengthAwarePaginator';
import Paginator from './pagination/Paginator';

const FILE = 'Lesgo/services/AuroraDbRDSProxyService';

/**
 * Service to connect to AWS Aurora Provisioned MySQL Database via RDS Proxy.
 * Use Services/AuroraDbServerlessService for the Serverless type via Data API.
 */
export default class AuroraDbRDSProxyService {
  constructor(opts = {}) {
    const { host, user, password, database } = opts;

    this.clientOpts = {
      host,
      user,
      password,
      database,
    };
  }

  async connect(connection = {}) {
    const clientOpts = isEmpty(connection) ? this.clientOpts : connection;
    logger.debug(`${FILE}::PREPARING DB CONNECTION`, {
      clientOpts,
    });

    const conn = await mysql.createConnection(clientOpts);
    conn.config.namedPlaceholders = true;
    logger.debug(`${FILE}::DB CONNECTED`);

    return conn;
  }

  /* eslint-disable-next-line class-methods-use-this */
  end(conn) {
    logger.debug(`${FILE}::ENDING DB CONNECTION`);
    conn.end();
    logger.debug(`${FILE}::DB DISCONNECTED`);
  }

  async query(sql, sqlParams, connection = {}) {
    const conn = await this.connect(connection);

    try {
      logger.debug(`${FILE}::QUERYING_DB`, { sql, sqlParams });
      const [results, fields] = await conn.execute(sql, sqlParams);
      logger.debug(`${FILE}::DB_RESPONSE`, { results, fields });

      return { results, fields };
    } catch (err) {
      throw new LesgoException(
        'Exception caught executing SQL Statement',
        `${FILE}::QUERY_EXECUTION_EXCEPTION`,
        500,
        { err }
      );
    } finally {
      this.end(conn);
    }
  }

  async select(sql, sqlParams, connection = {}) {
    const resp = await this.query(sql, sqlParams, connection);
    return resp.results;
  }

  async selectFirst(sql, sqlParams, connection = {}) {
    const resp = await this.query(sql, sqlParams, connection);
    return resp.results[0];
  }

  async selectPaginate(
    sql,
    sqlParams,
    perPage = 10,
    currentPage = 1,
    total = null,
    connection = {}
  ) {
    let paginator;
    if (typeof total === 'number') {
      paginator = new LengthAwarePaginator(
        this,
        sql,
        sqlParams,
        {
          perPage,
          currentPage,
          total,
        },
        connection
      );
    } else {
      paginator = new Paginator(
        this,
        sql,
        sqlParams,
        {
          perPage,
          currentPage,
        },
        connection
      );
    }

    return (await paginator).toObject();
  }

  async insert(sql, sqlParams, connection = {}) {
    const resp = await this.query(sql, sqlParams, connection);

    if (resp.results.affectedRows <= 0) {
      throw new LesgoException(
        'No records inserted from INSERT query',
        `${FILE}::NO_RECORDS_INSERTED`,
        400,
        { resp, sql, sqlParams }
      );
    }

    return resp.results.insertId;
  }

  async update(sql, sqlParams, connection = {}) {
    const resp = await this.query(sql, sqlParams, connection);

    if (resp.results.changedRows <= 0) {
      throw new LesgoException(
        'No records updated from UPDATE query',
        `${FILE}::NO_RECORDS_UPDATED`,
        400,
        { resp, sql, sqlParams }
      );
    }

    return Promise.resolve();
  }
}
