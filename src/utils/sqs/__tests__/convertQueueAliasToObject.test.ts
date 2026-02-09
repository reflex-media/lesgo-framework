import { convertQueueAliasToObject } from '../../sqs';
import appConfig from '../../../config/app';
import awsConfig from '../../../config/aws';

jest.mock('../../../config/app', () => ({
  __esModule: true,
  default: {
    stackName: 'lesgo-testing',
  },
}));

jest.mock('../../../config/aws', () => ({
  __esModule: true,
  default: {
    region: 'ap-southeast-1',
    accountId: '1234567890',
  },
}));

describe('convertQueueAliasToObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should convert a single queue alias to Queue object', () => {
    const queueAlias = 'testQueue';
    const result = convertQueueAliasToObject(queueAlias);

    expect(result).toEqual({
      alias: 'testQueue',
      name: 'lesgo-testing-testQueue',
      url: 'https://sqs.ap-southeast-1.amazonaws.com/1234567890/lesgo-testing-testQueue',
    });
  });

  it('should convert an array of queue aliases to Queue objects', () => {
    const queueAliases = ['queue1', 'queue2', 'queue3'];
    const result = convertQueueAliasToObject(queueAliases);

    expect(result).toEqual([
      {
        alias: 'queue1',
        name: 'lesgo-testing-queue1',
        url: 'https://sqs.ap-southeast-1.amazonaws.com/1234567890/lesgo-testing-queue1',
      },
      {
        alias: 'queue2',
        name: 'lesgo-testing-queue2',
        url: 'https://sqs.ap-southeast-1.amazonaws.com/1234567890/lesgo-testing-queue2',
      },
      {
        alias: 'queue3',
        name: 'lesgo-testing-queue3',
        url: 'https://sqs.ap-southeast-1.amazonaws.com/1234567890/lesgo-testing-queue3',
      },
    ]);
  });

  it('should handle empty array', () => {
    const result = convertQueueAliasToObject([]);

    expect(result).toEqual([]);
  });

  it('should use values from config', () => {
    expect(appConfig.stackName).toBe('lesgo-testing');
    expect(awsConfig.region).toBe('ap-southeast-1');
    expect(awsConfig.accountId).toBe('1234567890');
  });
});
