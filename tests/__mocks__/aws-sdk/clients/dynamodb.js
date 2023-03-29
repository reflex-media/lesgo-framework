import isEmpty from '../../../../src/utils/isEmpty';

export const DocumentClient = jest.fn().mockImplementation(opts => {
  return {
    query: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            const {
              TableName,
              KeyConditionExpression,
              ProjectionExpression,
              ExpressionAttributeValues,
              Select,
            } = params;

            if (isEmpty(TableName)) {
              reject(
                new Error('FAKER Missing TableName', 'FAKER_MISSING_TABLE_NAME')
              );
            }

            if (isEmpty(KeyConditionExpression)) {
              reject(
                new Error(
                  'FAKER Missing KeyConditionExpression',
                  'FAKER_MISSING_KeyConditionExpression'
                )
              );
            }

            if (
              !isEmpty(ProjectionExpression) &&
              !Array.isArray(ProjectionExpression)
            ) {
              reject(
                new Error(
                  'FAKER Missing ProjectionExpression',
                  'FAKER_MISSING_ProjectionExpression'
                )
              );
            }

            if (
              isEmpty(ExpressionAttributeValues) ||
              typeof ExpressionAttributeValues !== 'object'
            ) {
              reject(
                new Error(
                  'FAKER Missing ExpressionAttributeValues',
                  'FAKER_MISSING_ExpressionAttributeValues'
                )
              );
            }

            if (!isEmpty(Select) && Select === 'count') {
              resolve(1);
            }

            resolve({
              Items: [
                {
                  key: 123,
                  value: 'abc',
                },
              ],
              Count: 1,
              ScannedCount: 1,
            });
          });
        }),
      };
    }),
    put: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            const { TableName, Item } = params;

            if (isEmpty(TableName)) {
              reject(
                new Error('FAKER Missing TableName', 'FAKER_MISSING_TABLE_NAME')
              );
            }

            if (isEmpty(Item) || typeof Item !== 'object') {
              reject(
                new Error('FAKER Invalid Item type', 'FAKER_INVALID_ITEM')
              );
            }

            resolve({
              recordCount: 1,
              data: {},
            });
          });
        }),
      };
    }),
    update: jest.fn().mockImplementation(params => {
      return {
        promise: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            const {
              TableName,
              Key,
              UpdateExpression,
              ExpressionAttributeValues,
            } = params;

            if (isEmpty(TableName)) {
              reject(
                new Error('FAKER Missing TableName', 'FAKER_MISSING_TABLE_NAME')
              );
            }

            if (
              isEmpty(UpdateExpression) ||
              typeof UpdateExpression !== 'string'
            ) {
              reject(
                new Error(
                  'FAKER Missing UpdateExpression',
                  'FAKER_MISSING_UpdateExpression'
                )
              );
            }

            if (isEmpty(Key) || typeof Key !== 'object') {
              reject(new Error('FAKER Missing Key', 'FAKER_MISSING_Key'));
            }

            if (
              isEmpty(ExpressionAttributeValues) ||
              typeof ExpressionAttributeValues !== 'object'
            ) {
              reject(
                new Error(
                  'FAKER Missing ExpressionAttributeValues',
                  'FAKER_MISSING_ExpressionAttributeValues'
                )
              );
            }

            resolve({
              recordCount: 1,
              data: {},
            });
          });
        }),
      };
    }),
    mocked: {
      ...opts,
    },
  };
});

export default { DocumentClient };
