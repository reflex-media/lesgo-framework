import getClient from '../getClient';
import dynamodb from '../../dynamodb';
import getClientService from '../../../services/DynamoDbService/getClient';

jest.mock('../../../services/DynamoDbService/getClient');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call getClientService with the correct parameters', () => {
    const singletonConn = 'default';
    const region = 'us-west-2';

    getClient({ singletonConn, region });

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith({ singletonConn, region });
  });

  it('should call getClientService with default singletonConn if not provided', () => {
    const region = 'us-west-2';

    dynamodb.getClient({ region });

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith({
      region,
    });
  });

  it('should call getClientService with default region if not provided', () => {
    const singletonConn = 'default';

    getClient({ singletonConn });

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith({
      singletonConn,
    });
  });

  it('should call getClientService with default singletonConn and region if not provided', () => {
    getClient();

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith(undefined);
  });

  it('should call getClientService with default singletonConn and region if empty object provided', () => {
    getClient({});

    expect(getClientService).toHaveBeenCalledTimes(1);
    expect(getClientService).toHaveBeenCalledWith({});
  });
});
