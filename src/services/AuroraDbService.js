import dataApiClient from 'data-api-client';
import logger from '../utils/logger';
import LesgoException from '../exceptions/LesgoException';

export default class AuroraDbService {
  constructor(opts = {}) {
    this.client = null;
    this.connect(opts);
  }

  connect(opts) {
    const { secretArn, resourceArn, database } = opts;

    this.client = dataApiClient({
      secretArn,
      resourceArn,
      database,
    });
  }

  async query(sql, sqlParams) {
    try {
      logger.info('QUERYING AURORA DB', { sql, sqlParams });
      const resp = await this.client.query(sql, sqlParams);
      logger.info('AURORA DB RESPONSE', { resp });

      return resp;
    } catch (err) {
      throw new LesgoException(
        'Exception caught executing SQL Statement',
        'AURORADBSERVICE_QUERY_EXCEPTION',
        500,
        { err }
      );
    }
  }

  async select(sql, sqlParams) {
    const resp = await this.query(sql, sqlParams);
    return resp.records;
  }

  async selectFirst(sql, sqlParams) {
    const resp = await this.query(sql, sqlParams);
    return resp.records[0];
  }

  async insert(sql, sqlParams) {
    const resp = await this.query(sql, sqlParams);

    if (resp.numberOfRecordsUpdated <= 0) {
      throw new LesgoException(
        'No records inserted from INSERT query',
        'AURORADBSERVICE_NO_RECORDS_INSERTED',
        400,
        { resp, sql, sqlParams }
      );
    }

    return resp.insertId;
  }

  async update(sql, sqlParams) {
    const resp = await this.query(sql, sqlParams);

    if (resp.numberOfRecordsUpdated <= 0) {
      throw new LesgoException(
        'No records updated from UPDATE query',
        'AURORADBSERVICE_NO_RECORDS_UPDATED',
        400,
        { resp, sql, sqlParams }
      );
    }

    return Promise.resolve();
  }
}
