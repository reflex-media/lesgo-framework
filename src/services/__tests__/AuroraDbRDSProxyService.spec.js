import mysql from 'mysql2/promise';
import AuroraDbRDSProxyService from '../AuroraDbRDSProxyService';
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
  it('should not throw exception when instantiating', () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    expect(db.clientOpts).toMatchObject(auroraConfig);
  });

  it('should allow for empty config', () => {
    const db = new AuroraDbRDSProxyService();
    expect(db.clientOpts).toMatchObject({});
  });
});

describe('test AuroraDbRDSProxyService connect', () => {
  it('should be able to connect without custom config', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    const conn = await db.connect();

    expect(conn.mocked).toMatchObject(auroraConfig);
  });

  it('should be able to connect with custom config', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    const conn = await db.connect(customConfig);

    expect(conn.mocked).toMatchObject(customConfig);
  });
});

describe('test AuroraDbRDSProxyService query', () => {
  it('should return results object when calling query function', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    const resp = await db.query('SELECT_QUERY', {});

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
    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.select('SELECT_QUERY', {})).resolves.toMatchObject([
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

    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.select('INVALID_QUERY', {})).rejects.toMatchObject(error);
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

    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(
      db.select('RANDOM_QUERY', 'INVALID_QUERY_PARAMETERS')
    ).rejects.toMatchObject(error);
  });
});

describe('test AuroraDbRDSProxyService selectPaginate', () => {
  it('should return paginated results when calling selectPaginate function', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.selectPaginate('SELECT_QUERY', {})).resolves.toMatchObject(
      {
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
      }
    );
  });

  it('should return paginated results when calling selectPaginate with defined total', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(
      db.selectPaginate('SELECT_QUERY', {}, 1, 2, 1)
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
    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.selectFirst('SELECT_QUERY', {})).resolves.toMatchObject({
      id: 1,
      uid: 'some-uid-1',
    });
  });
});

describe('test AuroraDbRDSProxyService insert', () => {
  it('should return recordId when inserting record', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.insert('INSERT_QUERY', {})).resolves.toEqual(20);
  });

  it('should throw exception when calling insert with invalid query', async () => {
    const error = new LesgoException(
      'No records inserted from INSERT query',
      'AURORADBSERVICE_NO_RECORDS_INSERTED',
      400
    );

    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.insert('INVALID_INSERT_QUERY', {})).rejects.toMatchObject(
      error
    );
  });
});

describe('test AuroraDbRDSProxyService update', () => {
  it('should return success when making update query', async () => {
    const db = new AuroraDbRDSProxyService(auroraConfig);
    return db.update('UPDATE_QUERY', {});
  });

  it('should throw exception when caliing update with invalid query', async () => {
    const error = new LesgoException(
      'No records updated from UPDATE query',
      'AURORADBSERVICE_NO_RECORDS_UPDATED',
      400
    );

    const db = new AuroraDbRDSProxyService(auroraConfig);
    return expect(db.update('INVALID_UPDATE_QUERY', {})).rejects.toMatchObject(
      error
    );
  });
});
