import { query } from '../../proxy';
import queryService from '../../../../../services/RDSAuroraMySQLProxyService/query';

jest.mock('../../../../../services/RDSAuroraMySQLProxyService/query');

describe('query', () => {
  const connOptions = {
    host: '127.0.0.1',
    user: 'test_username',
    password: 'test_password',
    database: 'test_database',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call queryService with the correct arguments', async () => {
    const sql = `SELECT * FROM table WHERE id = ?`;
    const preparedValues = [5];
    const region = 'ap-southeast-1';
    const singletonConn = 'default';

    (queryService as jest.Mock).mockResolvedValueOnce([]);

    const res = await query(sql, preparedValues, connOptions, {
      region,
      singletonConn,
    });

    expect(queryService).toHaveBeenCalledWith(
      sql,
      preparedValues,
      connOptions,
      {
        region,
        singletonConn,
      }
    );
  });
});
