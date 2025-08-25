import { ConnectionOptions } from 'mysql2/promise';
import getMySQLProxyClient, { singleton } from '../getMySQLProxyClient';
import { disconnectMySQLClient } from '../../RDSAuroraMySQLProxyService';
import { query } from '../../RDSAuroraMySQLProxyService';
import { getSecretValue } from '../../../utils/secretsmanager';

jest.mock('../../../utils/secretsmanager');

describe('query', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('clear all singleton', async () => {
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
    (getSecretValue as jest.Mock).mockResolvedValue(connOptions);

    await Promise.all([
      getMySQLProxyClient(connOptions, clientOpts),
      getMySQLProxyClient(connOptions, {
        ...clientOpts,
        singletonConn: 'test1',
      }),
    ]);

    expect(Object.keys(singleton).length).toBe(2);

    const spy = jest.spyOn(Object.values(singleton)[0], 'end');

    await disconnectMySQLClient();

    expect(Object.keys(singleton).length).toBe(0);
    expect(spy).toHaveBeenCalled();
  });
});
