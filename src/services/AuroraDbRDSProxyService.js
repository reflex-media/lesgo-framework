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

    this.conn = {};
  }

  /**
   * Persists the database connection for later use
   *
   * @param {*} connectionOpts
   * @returns
   */
  async pConnect(connectionOpts = {}) {
    await this.connect({ ...connectionOpts, persists: true });
  }

  async connect(connectionOpts = {}) {
    const clientOpts = {
      host: connectionOpts.host ? connectionOpts.host : this.clientOpts.host,
      user: connectionOpts.user ? connectionOpts.user : this.clientOpts.user,
      password: connectionOpts.password
        ? connectionOpts.password
        : this.clientOpts.password,
      database: connectionOpts.database
        ? connectionOpts.database
        : this.clientOpts.database,
    };

    const persistentConn = connectionOpts.persists;

    logger.debug(`${FILE}::PREPARING DB CONNECTION`, {
      clientOpts,
      persistentConn,
    });

    const conn = await mysql.createConnection(clientOpts);
    conn.config.namedPlaceholders = true;
    logger.debug(`${FILE}::DB CONNECTED`);

    if (persistentConn) {
      this.conn = conn;
    }

    return conn;
  }

  /* eslint-disable-next-line class-methods-use-this */
  async end(conn = {}) {
    logger.debug(`${FILE}::ENDING DB CONNECTION`);
    if (!isEmpty(conn)) {
      await conn.end();
      logger.debug(`${FILE}::DB DISCONNECTED`);
    } else {
      await this.conn.end();
      logger.debug(`${FILE}::PERSISTED DB DISCONNECTED`);
    }
  }

  async query(sql, sqlParams, connectionOpts = {}) {
    let conn = {};
    if (!isEmpty(connectionOpts)) {
      conn = await this.connect(connectionOpts);
    } else if (isEmpty(this.conn)) {
      conn = await this.connect();
    } else {
      conn = this.conn;
    }

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
      if (isEmpty(this.conn) || !isEmpty(connectionOpts)) await this.end(conn);
    }
  }

  async select(sql, sqlParams, connectionOpts = {}) {
    const resp = await this.query(sql, sqlParams, connectionOpts);
    return resp.results;
  }

  async selectFirst(sql, sqlParams, connectionOpts = {}) {
    const resp = await this.query(sql, sqlParams, connectionOpts);
    return resp.results[0];
  }

  async selectPaginate(
    sql,
    sqlParams,
    perPage = 10,
    currentPage = 1,
    total = null,
    connectionOpts = {}
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
        connectionOpts
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
        connectionOpts
      );
    }

    return (await paginator).toObject();
  }

  async insert(sql, sqlParams, connectionOpts = {}) {
    const resp = await this.query(sql, sqlParams, connectionOpts);

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

  async update(sql, sqlParams, connectionOpts = {}) {
    const resp = await this.query(sql, sqlParams, connectionOpts);

    if (resp.results.changedRows <= 0) {
      logger.warn(`${FILE}::No records updated from UPDATE query`, {
        sql,
        sqlParams,
      });
    }

    return Promise.resolve();
  }
}
