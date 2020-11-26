import { DocumentClient } from 'aws-sdk/clients/dynamodb'; // eslint-disable-line import/no-extraneous-dependencies
import DynamoDbService from '../DynamoDbService';
import LesgoException from '../../exceptions/LesgoException';

describe('test DynamoDbService connect', () => {
  it('should not throw an error when instantiating DynamoDbService', () => {
    // eslint-disable-next-line no-unused-vars
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    expect(DocumentClient).toHaveBeenCalledWith({ region: 'ap-southeast-1' });
  });

  it('should throw an error when instantiating DynamoDbService with missing region', () => {
    try {
      expect(new DynamoDbService()).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          'Missing required parameter region',
          'DYNAMODB_MISSING_PARAMETER'
        )
      );
    }
  });
});

describe('test DynamoDbService query', () => {
  it('should return a list of items when calling query', () => {
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

  it('should throw exception when tableName is empty', () => {
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

  it('should throw exception when expressionAttributeValues is not an object', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = 'someString';
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

  it('should throw exception when projectionExpression is not an array', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = { ':keyId': 123 };
    const projectionExpression = 'someString';

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

  it('should throw exception when tableName is empty', () => {
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

  it('should throw exception when expressionAttributeValues is not an object', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const keyConditionExpression = 'key = :keyId';
    const expressionAttributeValues = 'someString';

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

  it('should throw exception when tableName is empty', () => {
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

  it('should throw exception when item is not an object', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const item = 'someString';

    return expect(db.put(tableName, item)).rejects.toThrow(
      new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB PUT OPERATION',
        'DYNAMODB_PUT_EXCEPTION'
      )
    );
  });
});

describe('test DynamoDbService update', () => {
  it('should return count when calling query', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const key = { key: 123 };
    const updateExpression = 'SET value = :value';
    const expressionAttributeValues = { ':value': 'asd' };

    return expect(
      db.update(tableName, key, updateExpression, expressionAttributeValues)
    ).resolves.toEqual({ recordCount: 1, data: {} });
  });

  it('should throw exception when tableName is empty', () => {
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

  it('should throw exception when expressionAttributeValues is not an object', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const key = { key: 123 };
    const updateExpression = 'SET value = :value';
    const expressionAttributeValues = 'someString';

    return expect(
      db.update(tableName, key, updateExpression, expressionAttributeValues)
    ).rejects.toThrow(
      new LesgoException(
        'EXCEPTION ENCOUNTERED FOR DYNAMODB UPDATE OPERATION',
        'DYNAMODB_UPDATE_EXCEPTION'
      )
    );
  });

  it('should throw exception when key is not an object', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const key = 123;
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

  it('should throw exception when updateExpression is not a string', () => {
    const db = new DynamoDbService({ region: 'ap-southeast-1' });

    const tableName = 'sampleTable';
    const key = { key: 123 };
    const updateExpression = { some: 'value' };
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
