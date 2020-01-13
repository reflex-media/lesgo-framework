import {
  Client as ElasticsearchClient,
  Connection as DefaultConnection,
} from '@elastic/elasticsearch';
import AwsConnection from './aws/AwsElasticsearchConnection';

class ElasticsearchService {
  constructor({ index, type, connection, options }) {
    this.index = index;
    this.type = type;
    this.options = options;

    this.setConnection(connection);
  }

  setConnection(conn) {
    let Connection = null;

    switch (conn) {
      case 'aws':
        Connection = AwsConnection;
        break;

      default:
        Connection = DefaultConnection;
        break;
    }

    this.client = new ElasticsearchClient({
      ...this.options,
      Connection,
    });

    return this;
  }

  getClient() {
    return this.client;
  }

  search(body) {
    return new Promise((resolve, reject) => {
      const param = {
        index: this.index,
        type: this.type,
        body,
      };
      this.client.search(param, (err, response) => {
        /* istanbul ignore next */
        if (err) {
          reject(err);
        }

        this.result = response;

        resolve(response);
      });
    });
  }

  /**
   * @param {*} settings
   * @param {*} index
   *
   *  const settings = {
   *    index: {
   *       number_of_shards: 3,
   *       number_of_replicas: 2,
   *     },
   *   };
   */
  createIndices(settings, index = null) {
    const params = {
      index: index || this.index,
      body: settings,
    };

    return new Promise((resolve, reject) => {
      this.client.indices.create(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  deleteIndices(index, options = {}) {
    const params = {
      index,
      ...options,
    };

    return new Promise((resolve, reject) => {
      this.client.indices.delete(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  existIndices(index, options = {}) {
    const params = { index, ...options };
    return new Promise((resolve, reject) => {
      this.client.indices.exists(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response.body);
      });
    });
  }

  putMapping(index, type, body) {
    const params = { index, type, body: { properties: body } };
    return new Promise((resolve, reject) => {
      this.client.indices.putMapping(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  get(id) {
    const params = {
      index: this.index,
      type: this.type,
      id,
    };

    return new Promise((resolve, reject) => {
      this.client.get(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  indexOrCreateById(body, refresh = false) {
    const params = {
      index: this.index,
      type: this.type,
      id: body.id,
      body,
      refresh,
    };

    return new Promise((resolve, reject) => {
      this.client.index(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  bulkIndex(bodies) {
    return new Promise((resolve, reject) => {
      this.client.bulk(
        { body: this.constructBulkIndex(bodies) },
        (err, response) => {
          // eslint-disable-next-line no-unused-expressions
          err ? /* istanbul ignore next */ reject(err) : resolve(response);
        }
      );
    });
  }

  create(id, body) {
    const params = {
      index: this.index,
      type: this.type,
      id,
      body,
    };

    return new Promise((resolve, reject) => {
      this.client.index(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  updateById(id) {
    const params = {
      index: this.index,
      type: this.type,
      id,
    };

    return new Promise((resolve, reject) => {
      this.client.get(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? /* istanbul ignore next */ reject(err) : resolve(response);
      });
    });
  }

  /**
   * Bulk operation very confusing if read from documentation
   * use this example from blogs instead
   *
   * @ref https://taohiko.wordpress.com/2014/10/15/example-javascript-to-use-bulk-command-of-elasticsearch/
   */
  constructBulkIndex(bodies) {
    const bulk = [];

    bodies.forEach(body => {
      // array 0 - add index operation
      bulk.push({
        index: {
          _index: this.index,
          _type: this.type,
          _id: body.profile_id,
        },
      });
      // array 1 - profile attributes
      bulk.push(body);
    });

    return bulk;
  }
}

export default ElasticsearchService;
