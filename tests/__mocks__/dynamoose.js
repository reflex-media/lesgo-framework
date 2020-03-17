/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
const Model = jest.fn().mockImplementation(object => {
  return {
    ...object,
    put: jest.fn().mockImplementation(callback => {
      !object.email ? callback('mockedError') : callback(null, object);
    }),
  };
});

const Query = jest.fn().mockImplementation(attr => {
  return {
    eq: jest.fn().mockImplementation(value => {
      return {
        exec: jest.fn().mockImplementation(callback => {
          !attr
            ? callback('mockedError')
            : callback(null, [
                new Model({ email: 'test1@example.com' }),
                new Model({ email: 'test2@example.com' }),
              ]);
        }),
      };
    }),
  };
});

Model.get = jest.fn().mockImplementation((params, callback) => {
  !params.email ? callback('mockedError') : callback(null, params);
});

Model.batchPut = jest.fn().mockImplementation((list, options, callback) => {
  list === null ? callback('mockedError') : callback(null);
});

Model.update = jest.fn().mockImplementation((object, callback) => {
  object === null ? callback('mockedError') : callback(null, 1);
});

Model.query = Query;

const model = jest.fn().mockImplementation((table, schema, options = {}) => {
  return Model;
});

export default {
  model,
};
