import { getClient } from '../../proxy';
import getMySQLProxyClient from '../../../../../services/RDSAuroraMySQLProxyService/getMySQLProxyClient';

jest.mock(
  '../../../../../services/RDSAuroraMySQLProxyService/getMySQLProxyClient'
);

describe('getClient', () => {
  const connOptions = {
    host: '127.0.0.1',
    user: 'test_username',
    password: 'test_password',
    database: 'test_database',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getMySQLProxyClient with the correct parameters', () => {
    const singletonConn = 'default';
    const region = 'us-west-2';

    getClient(connOptions, { singletonConn, region });

    expect(getMySQLProxyClient).toHaveBeenCalledTimes(1);
    expect(getMySQLProxyClient).toHaveBeenCalledWith(connOptions, {
      singletonConn,
      region,
    });
  });

  it('should call getMySQLProxyClient with default connOptions, singletonConn if not provided', () => {
    const region = 'us-west-2';

    getClient(connOptions, { region });

    expect(getMySQLProxyClient).toHaveBeenCalledTimes(1);
    expect(getMySQLProxyClient).toHaveBeenCalledWith(connOptions, {
      region,
    });
  });

  it('should call getMySQLProxyClient with default connOptions, region if not provided', () => {
    const singletonConn = 'default';

    getClient(connOptions, { singletonConn });

    expect(getMySQLProxyClient).toHaveBeenCalledTimes(1);
    expect(getMySQLProxyClient).toHaveBeenCalledWith(connOptions, {
      singletonConn,
    });
  });

  it('should call getMySQLProxyClient with default connOptions, singletonConn and region if not provided', () => {
    getClient();

    expect(getMySQLProxyClient).toHaveBeenCalledTimes(1);
    expect(getMySQLProxyClient).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should call getMySQLProxyClient with default connOptions, singletonConn and region if empty object provided', () => {
    getClient({});

    expect(getMySQLProxyClient).toHaveBeenCalledTimes(1);
    expect(getMySQLProxyClient).toHaveBeenCalledWith({}, undefined);
  });
});
