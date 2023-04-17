import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import DynamoDbService from '../DynamoDbService';
import LesgoException from '../../exceptions/LesgoException';

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('test DynamoDbService connect', () => {
  it('should throw an error when instantiating DynamoDbService with missing region', () => {
    let err = {};
    try {
      expect(new DynamoDbService()).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Missing required parameter region');
      expect(err.code).toEqual('DYNAMODB_MISSING_PARAMETER');
    }
  });
});

describe('test DynamoDbService query', () => {
  it('should return a list of items when calling query', () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          key: 123,
          value: 'abc',
        },
      ],
      Count: 1,
      ScannedCount: 1,
    });

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = { ':keyId': 123 };
    const projectionExpression = ['key', 'value'];

    return expect(
      db.query(
        tableName,
        keyConditionExpression,
        expressionAttributeValues,
        projectionExpression
      )
    ).resolves.toMatchObject([
      {
        key: 123,
        value: 'abc',
      },
    ]);
  });

  it('should throw exception if invalid command', () => {
    ddbMock
      .on(QueryCommand)
      .rejects(new Error('Fake error message', 'FAKE_ERROR_THROWN'));

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = '';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = { ':keyId': 123 };
    const projectionExpression = ['key', 'value'];

    return expect(
      db.query(
        tableName,
        keyConditionExpression,
        expressionAttributeValues,
        projectionExpression
      )
    ).rejects.toThrow(
      new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB QUERY OPERATION',
        'DYNAMODB_QUERY_EXCEPTION'
      )
    );
  });
});

describe('test DynamoDbService queryCount', () => {
  it('should return count when calling query', () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          key: 123,
          value: 'abc',
        },
      ],
      Count: 1,
      ScannedCount: 1,
    });

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = { ':keyId': 123 };

    return expect(
      db.queryCount(
        tableName,
        keyConditionExpression,
        expressionAttributeValues
      )
    ).resolves.toEqual(1);
  });

  it('should throw exception if invalid command', () => {
    ddbMock
      .on(QueryCommand)
      .rejects(new Error('Fake error message', 'FAKE_ERROR_THROWN'));

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = '';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = { ':keyId': 123 };

    return expect(
      db.queryCount(
        tableName,
        keyConditionExpression,
        expressionAttributeValues
      )
    ).rejects.toThrow(
      new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB QUERY COUNT OPERATION',
        'DYNAMODB_QUERY_EXCEPTION'
      )
    );
  });
});

describe('test DynamoDbService put', () => {
  it('should return recordCount when calling put', () => {
    ddbMock.on(PutCommand).resolves({
      recordCount: 1,
      data: {},
    });

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const item = {
      key: 123,
      value: 'abc',
    };

    return expect(db.put(tableName, item)).resolves.toEqual({
      recordCount: 1,
      data: {},
    });
  });

  it('should throw exception if invalid command', () => {
    ddbMock
      .on(PutCommand)
      .rejects(new Error('Fake error message', 'FAKE_ERROR_THROWN'));

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = '';
    const item = {
      key: 123,
      value: 'abc',
    };

    return expect(db.put(tableName, item)).rejects.toThrow(
      new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB PUT OPERATION',
        'DYNAMODB_PUT_EXCEPTION'
      )
    );
  });
});

describe('test DynamoDbService update', () => {
  it('should return count when calling query with conditionExpression', () => {
    ddbMock.on(UpdateCommand).resolves({
      recordCount: 1,
      data: {},
    });

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const key = { key: 123 };
    const updateExpression = 'SET value = :value';
    const expressionAttributeValues = { ':value': 'asd', ':key': 'key' };
    const conditionExpression = 'key = :key';

    return expect(
      db.update(tableName, key, updateExpression, expressionAttributeValues, { conditionExpression: 'key = :key' })
    ).resolves.toEqual({ recordCount: 1, data: {} });
  });

  it('should return count when calling query', () => {
    ddbMock.on(UpdateCommand).resolves({
      recordCount: 1,
      data: {},
    });

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const key = { key: 123 };
    const updateExpression = 'SET value = :value';
    const expressionAttributeValues = { ':value': 'asd' };

    return expect(
      db.update(tableName, key, updateExpression, expressionAttributeValues)
    ).resolves.toEqual({ recordCount: 1, data: {} });
  });

  it('should throw exception if invalid command', () => {
    ddbMock
      .on(UpdateCommand)
      .rejects(new Error('Fake error message', 'FAKE_ERROR_THROWN'));

    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = '';
    const key = { key: 123 };
    const updateExpression = 'SET value = :value';
    const expressionAttributeValues = { ':value': 'asd' };

    return expect(
      db.update(tableName, key, updateExpression, expressionAttributeValues)
    ).rejects.toThrow(
      new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB UPDATE OPERATION',
        'DYNAMODB_UPDATE_EXCEPTION'
      )
    );
  });
});
