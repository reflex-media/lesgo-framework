import { ConnectionOptions } from 'mysql2/promise';
import { LesgoException } from '../../../exceptions';
import getMySQLProxyClient from '../getMySQLProxyClient';
import { query } from '../../RDSAuroraMySQLProxyService';

jest.mock('../getMySQLProxyClient');

describe('query', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClient with the correct arguments', async () => {
    const sql = 'SELECT * FROM users';
    const preparedValues = [1, 'John'];
    const connOptions: ConnectionOptions = {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'test',
    };
    const clientOpts = {
      region: 'us-west-2',
      endpoint: 'http://localhost:8000',
    };
    const connectionMock = {
      execute: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
    };
    (getMySQLProxyClient as jest.Mock).mockResolvedValue(connectionMock);

    await query(sql, preparedValues, connOptions, clientOpts);

    expect(getMySQLProxyClient).toHaveBeenCalledWith(connOptions, clientOpts);
  });

  it('should execute the query and return the response', async () => {
    const sql = 'SELECT * FROM users';
    const preparedValues = [1, 'John'];
    const connectionMock = {
      execute: jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]),
    };
    (getMySQLProxyClient as jest.Mock).mockResolvedValue(connectionMock);

    const resp = await query(sql, preparedValues);

    expect(connectionMock.execute).toHaveBeenCalledWith(sql, preparedValues);
    expect(resp).toEqual([{ id: 1, name: 'John' }]);
  });

  it('should throw a LesgoException if the query fails', async () => {
    const sql = 'SELECT * FROM users';
    const preparedValues = [1, 'John'];
    const connOptions: ConnectionOptions = {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'test',
    };
    const clientOpts = {
      region: 'us-west-2',
      endpoint: 'http://localhost:8000',
    };
    const error = new Error('Query failed');
    const connectionMock = {
      execute: jest.fn().mockRejectedValue(error),
    };
    (getMySQLProxyClient as jest.Mock).mockResolvedValue(connectionMock);

    await expect(
      query(sql, preparedValues, connOptions, clientOpts)
    ).rejects.toThrow(
      new LesgoException(
        'Failed to query',
        'lesgo.services.RDSAuroraMySQLService.query::QUERY_ERROR',
        500,
        {
          err: error,
          sql,
          preparedValues,
          connOptions,
          clientOpts,
        }
      )
    );
  });
});
