import dataApiClient from 'data-api-client';
import dbConfig from 'config/db'; // eslint-disable-line import/no-unresolved
import AuroraDbService from '../AuroraDbService';
import LesgoException from '../../exceptions/LesgoException';

const auroraConfig = {
  secretArn: 'fakeSecretArn',
  resourceArn: 'fakeResourceArn',
  database: 'fakeDbName',
};

describe('test AuroraDbService instantiate', () => {
  it('should not throw exception when instantiating', () => {
    const db = new AuroraDbService();

    expect(dataApiClient).toHaveBeenCalledWith({});
    expect(db.client.mocked).toMatchObject({});
  });

  it('should not throw exception with custom config', () => {
    const db = new AuroraDbService(auroraConfig);

    expect(dataApiClient).toHaveBeenCalledWith(auroraConfig);
    expect(db.client.mocked).toMatchObject(auroraConfig);
  });

  it('should not throw exception with custom region', () => {
    const db = new AuroraDbService({
      ...auroraConfig,
      region: 'ap-southeast-1',
    });

    expect(dataApiClient).toHaveBeenCalledWith(auroraConfig);
    expect(db.client.mocked).toMatchObject(auroraConfig);
  });
});

describe('test AuroraDbService connect', () => {
  it('should have updated credentials when calling connect', () => {
    const db = new AuroraDbService(auroraConfig);
    db.connect({
      secretArn: dbConfig.secretCommandArn,
    });

    expect(db.client.mocked).toMatchObject({
      secretArn: dbConfig.secretCommandArn,
    });
  });
});

describe('test AuroraDbService query', () => {
  it('should return records object when calling query function', async () => {
    const db = new AuroraDbService(auroraConfig);
    return expect(db.query('SELECT_QUERY', {})).resolves.toMatchObject({
      records: [
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
});

describe('test AuroraDbService select', () => {
  it('should return array records when calling select function', async () => {
    const db = new AuroraDbService(auroraConfig);
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

    const db = new AuroraDbService(auroraConfig);
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

    const db = new AuroraDbService(auroraConfig);
    return expect(
      db.select('RANDOM_QUERY', 'INVALID_QUERY_PARAMETERS')
    ).rejects.toMatchObject(error);
  });
});

describe('test AuroraDbService selectPaginate', () => {
  it('should return paginated records when calling selectPaginate function', async () => {
    const db = new AuroraDbService(auroraConfig);
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

  it('should return paginated records when calling selectPaginate with defined total', async () => {
    const db = new AuroraDbService(auroraConfig);
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

describe('test AuroraDbService selectFirst', () => {
  it('should only return the first record when calling selectFirst', async () => {
    const db = new AuroraDbService(auroraConfig);
    return expect(db.selectFirst('SELECT_QUERY', {})).resolves.toMatchObject({
      id: 1,
      uid: 'some-uid-1',
    });
  });
});

describe('test AuroraDbService insert', () => {
  it('should return recordId when inserting record', async () => {
    const db = new AuroraDbService(auroraConfig);
    return expect(db.insert('INSERT_QUERY', {})).resolves.toEqual(20);
  });

  it('should throw exception when calling insert with invalid query', async () => {
    const error = new LesgoException(
      'No records inserted from INSERT query',
      'AURORADBSERVICE_NO_RECORDS_INSERTED',
      400
    );

    const db = new AuroraDbService(auroraConfig);
    return expect(db.insert('INVALID_INSERT_QUERY', {})).rejects.toMatchObject(
      error
    );
  });
});

describe('test AuroraDbService update', () => {
  it('should return success when making update query', async () => {
    const db = new AuroraDbService(auroraConfig);
    return db.update('UPDATE_QUERY', {});
  });

  it('should throw exception when caliing update with invalid query', async () => {
    const error = new LesgoException(
      'No records updated from UPDATE query',
      'AURORADBSERVICE_NO_RECORDS_UPDATED',
      400
    );

    const db = new AuroraDbService(auroraConfig);
    return expect(db.update('INVALID_UPDATE_QUERY', {})).rejects.toMatchObject(
      error
    );
  });
});
