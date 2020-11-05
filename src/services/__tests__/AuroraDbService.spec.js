import dataApiClient from 'data-api-client';
import dbConfig from 'Config/db'; // eslint-disable-line import/no-unresolved
import AuroraDbService from '../AuroraDbService';
import LesgoException from '../../exceptions/LesgoException';

const auroraConfig = {
  secretArn: 'fakeSecretArn',
  resourceArn: 'fakeResourceArn',
  database: 'fakeDbName',
};

describe('ServicesGroup: test AuroraDbService', () => {
  it('test instantiate default AuroraDbService', () => {
    const db = new AuroraDbService();

    expect(dataApiClient).toHaveBeenCalledWith({});
    expect(db.client.mocked).toMatchObject({});
  });

  it('test instantiate AuroraDbService with custom config', () => {
    const db = new AuroraDbService(auroraConfig);

    expect(dataApiClient).toHaveBeenCalledWith(auroraConfig);
    expect(db.client.mocked).toMatchObject(auroraConfig);
  });

  it('test update connection to AuroraDbService', () => {
    const db = new AuroraDbService(auroraConfig);
    db.connect({
      secretArn: dbConfig.secretCommandArn,
    });

    expect(db.client.mocked).toMatchObject({
      secretArn: dbConfig.secretCommandArn,
    });
  });

  it('test query', async () => {
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

  it('test select query', async () => {
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

  it('test selectFirst query', async () => {
    const db = new AuroraDbService(auroraConfig);
    return expect(db.selectFirst('SELECT_QUERY', {})).resolves.toMatchObject({
      id: 1,
      uid: 'some-uid-1',
    });
  });

  it('test insert query', async () => {
    const db = new AuroraDbService(auroraConfig);
    return expect(db.insert('INSERT_QUERY', {})).resolves.toEqual(20);
  });

  it('test update query', async () => {
    const db = new AuroraDbService(auroraConfig);
    return db.update('UPDATE_QUERY', {});
  });

  it('test invalid query', async () => {
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

  it('test invalid query parameters', async () => {
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

  it('test invalid insert query', async () => {
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

  it('test invalid update query', async () => {
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
