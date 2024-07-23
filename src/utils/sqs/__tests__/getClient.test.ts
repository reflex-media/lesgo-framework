import getClient from '../getClient';
import sqs from '../../sqs';
import getClientService from '../../../services/SQSService/getClient';

jest.mock('../../../services/SQSService/getClient');

describe('getClient', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new client if singleton connection is not yet created', () => {
    getClient();

    expect(getClientService).toHaveBeenCalledWith(undefined);
  });

  it('should call getClientService with defined region and singletonConn', () => {
    const region = 'us-west-2';
    const singletonConn = 'customSingletonConn';

    sqs.getClient({ region, singletonConn });

    expect(getClientService).toHaveBeenCalledWith({
      singletonConn,
      region,
    });
  });
});
