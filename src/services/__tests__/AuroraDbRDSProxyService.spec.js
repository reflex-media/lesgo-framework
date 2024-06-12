import mysql from 'mysql2/promise';
import * as AuroraDbRDSProxyService from '../AuroraDbRDSProxyService';
import LesgoException from '../../exceptions/LesgoException';

const auroraConfig = {
  host: 'some-fake-host',
  user: 'fakeUsername',
  password: 'fakePassword',
  database: 'fakeDbName',
};

const customConfig = {
  host: 'some-fake-host-2',
  user: 'fakeUsername2',
  password: 'fakePassword2',
  database: 'fakeDbName2',
};

describe('test AuroraDbRDSProxyService instantiate', () => {
  it('should throw a type error if instantiated', () => {
    try {
      expect(new AuroraDbRDSProxyService(auroraConfig)).toThrow();
    } catch (error) {
      expect(error.name).toBe('TypeError');
      expect(error.message).toBe(
        'AuroraDbRDSProxyService is not a constructor'
      );
    }
  });
});

describe('test AuroraDbRDSProxyService connect', () => {
  it('should throw an error if no config is passed', async () => {
    try {
      expect(await AuroraDbRDSProxyService.connect()).toThrow();
    } catch (error) {
      expect(error.name).toBe('LesgoException');
      expect(error.statusCode).toBe(500);
      expect(error.message).toContain('Missing required');
    }
  });

  it('should be able to connect with custom config', async () => {
    const conn = await AuroraDbRDSProxyService.connect(customConfig);

    expect(conn.mocked).toMatchObject(customConfig);
  });
});

describe('test AuroraDbRDSProxyService query', () => {
  it('should return results object when calling query function', async () => {
    const resp = await AuroraDbRDSProxyService.query(
      'SELECT_QUERY',
      {},
      auroraConfig
    );

    expect(resp).toMatchObject({
      results: [
        {
          id: 1,
          uid: 'some-uid-1',
        },
        {
          id: 2,
          uid: 'some-uid-2',
        },
      ],
    });

    expect(mysql.createConnection).toHaveBeenCalled();
  });

  it('should return results object when calling querying with connection options passed', async () => {
    const resp = await AuroraDbRDSProxyService.query(
      'SELECT_QUERY',
      {},
      auroraConfig
    );

    expect(resp).toMatchObject({
      results: [
        {
          id: 1,
          uid: 'some-uid-1',
        },
        {
          id: 2,
          uid: 'some-uid-2',
        },
      ],
    });

    expect(mysql.createConnection).toHaveBeenCalled();
  });

  it('should return results object when calling querying with no connection options passed and persistent conn', async () => {
    await AuroraDbRDSProxyService.pConnect(auroraConfig);

    const resp = await AuroraDbRDSProxyService.query('SELECT_QUERY', {});

    expect(resp).toMatchObject({
      results: [
        {
          id: 1,
          uid: 'some-uid-1',
        },
        {
          id: 2,
          uid: 'some-uid-2',
        },
      ],
    });

    expect(mysql.createConnection).toHaveBeenCalled();
  });
});

describe('test AuroraDbRDSProxyService select', () => {
  it('should return array results when calling select function', async () => {
    return expect(
      AuroraDbRDSProxyService.select('SELECT_QUERY', {}, auroraConfig)
    ).resolves.toMatchObject([
      {
        id: 1,
        uid: 'some-uid-1',
      },
      {
        id: 2,
        uid: 'some-uid-2',
      },
    ]);
  });

  it('should throw an exception when writing with invalid query', async () => {
    const error = new LesgoException(
      'Exception caught executing SQL Statement',
      'AURORADBSERVICE_QUERY_EXCEPTION',
      500,
      {
        err: {
          code: 'BadRequestException',
        },
      }
    );

    return expect(
      AuroraDbRDSProxyService.select('INVALID_QUERY', {}, auroraConfig)
    ).rejects.toMatchObject(error);
  });

  it('should throw an exception when calling select with invalid query parameters', async () => {
    const error = new LesgoException(
      'Exception caught executing SQL Statement',
      'AURORADBSERVICE_QUERY_EXCEPTION',
      500,
      {
        err: {
          code: 'BadRequestException',
        },
      }
    );

    return expect(
      AuroraDbRDSProxyService.select(
        'RANDOM_QUERY',
        'INVALID_QUERY_PARAMETERS',
        auroraConfig
      )
    ).rejects.toMatchObject(error);
  });
});

describe('test AuroraDbRDSProxyService selectPaginate', () => {
  it('should return paginated results when calling selectPaginate function', async () => {
    return expect(
      AuroraDbRDSProxyService.selectPaginate(
        'SELECT_QUERY',
        {},
        10,
        1,
        null,
        auroraConfig
      )
    ).resolves.toMatchObject({
      count: 2,
      previous_page: false,
      current_page: 1,
      next_page: false,
      per_page: 10,
      items: [
        {
          id: 1,
          uid: 'some-uid-1',
        },
        {
          id: 2,
          uid: 'some-uid-2',
        },
      ],
    });
  });

  it('should return paginated results when calling selectPaginate with defined total', async () => {
    return expect(
      AuroraDbRDSProxyService.selectPaginate(
        'SELECT_QUERY',
        {},
        1,
        2,
        1,
        auroraConfig
      )
    ).resolves.toMatchObject({
      count: 1,
      previous_page: 1,
      current_page: 2,
      next_page: 3,
      per_page: 1,
      items: [
        {
          id: 1,
          uid: 'some-uid-1',
        },
      ],
    });
  });
});

describe('test AuroraDbRDSProxyService selectFirst', () => {
  it('should only return the first record when calling selectFirst', async () => {
    return expect(
      AuroraDbRDSProxyService.selectFirst('SELECT_QUERY', {}, auroraConfig)
    ).resolves.toMatchObject({
      id: 1,
      uid: 'some-uid-1',
    });
  });
});

describe('test AuroraDbRDSProxyService insert', () => {
  it('should return recordId when inserting record', async () => {
    return expect(
      AuroraDbRDSProxyService.insert('INSERT_QUERY', {}, auroraConfig)
    ).resolves.toEqual(20);
  });

  it('should throw exception when calling insert with invalid query', async () => {
    const error = new LesgoException(
      'No records inserted from INSERT query',
      'AURORADBSERVICE_NO_RECORDS_INSERTED',
      400
    );

    return expect(
      AuroraDbRDSProxyService.insert('INVALID_INSERT_QUERY', {}, auroraConfig)
    ).rejects.toMatchObject(error);
  });
});

describe('test AuroraDbRDSProxyService update', () => {
  it('should return success when making update query', async () => {
    return expect(
      AuroraDbRDSProxyService.update('UPDATE_QUERY', {}, auroraConfig)
    ).resolves.not.toThrow();
  });

  it('should throw not exception when caliing update with invalid query', async () => {
    return expect(
      AuroraDbRDSProxyService.update('INVALID_UPDATE_QUERY', {}, auroraConfig)
    ).resolves.not.toThrow();
  });
});

describe('test AuroraDbRDSProxyService pConnect', () => {
  it('should throw an error if called without custom config', async () => {
    try {
      expect(await AuroraDbRDSProxyService.pConnect()).toThrow();
    } catch (error) {
      expect(error.name).toBe('LesgoException');
      expect(error.statusCode).toBe(500);
      expect(error.message).toContain('Missing required');
    }
  });

  it('should be able to connect with custom config', async () => {
    const db = await AuroraDbRDSProxyService.pConnect(customConfig);

    expect(db.mocked).toMatchObject(customConfig);
  });
});

describe('test AuroraDbRDSProxyService end', () => {
  it('should end the connection when passed', async () => {
    const conn = await AuroraDbRDSProxyService.connect(auroraConfig);
    await AuroraDbRDSProxyService.end(conn);

    expect(conn.end).toHaveBeenCalledTimes(1);
  });

  it('should end the persisted connection when none is passed', async () => {
    const db = await AuroraDbRDSProxyService.pConnect(auroraConfig);

    await AuroraDbRDSProxyService.end();

    expect(db.end).toHaveBeenCalledTimes(1);
  });
});
