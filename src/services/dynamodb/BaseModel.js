/* eslint-disable no-unused-expressions */
import dynamodb from '../../utils/dynamodb';
import LesgoException from '../../exceptions/LesgoException';

class BaseModel {
  constructor(table, schema, object, options = {}) {
    this.schema = schema;
    this.table = table;
    const Model = dynamodb().model(table, schema, options);
    this.Model = Model;
    this.instance = new Model(object);
  }

  async create() {
    return new Promise((resolve, reject) => {
      this.instance.put(err => {
        if (err) {
          reject(new LesgoException(err, 'DYNAMODB_SAVE_ERROR'));
        }
        resolve(1);
      });
    });
  }

  async createMany(objectArray, options = {}) {
    return new Promise((resolve, reject) => {
      this.Model.batchPut(objectArray, options, err => {
        err
          ? reject(new LesgoException(err, 'DYNAMODB_SAVEMANY_ERROR'))
          : resolve();
      });
    });
  }

  async update(object) {
    return new Promise((resolve, reject) => {
      this.Model.update(object, err => {
        err
          ? reject(new LesgoException(err, 'DYNAMODB_UPDATE_ERROR'))
          : resolve(1);
      });
    });
  }

  async find(object) {
    return new Promise((resolve, reject) => {
      this.Model.get(object, (err, instance) => {
        if (err) {
          reject(new LesgoException(err, 'DYNAMODB_FIND_ERROR'));
        }
        this.instance = instance;
        resolve(this);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async promisedExec(query) {
    return new Promise((resolve, reject) => {
      query.exec((err, list) => {
        err
          ? reject(new LesgoException(err, 'DYNAMODB_QUERY_ERROR'))
          : resolve(list);
      });
    });
  }
}

export default BaseModel;
