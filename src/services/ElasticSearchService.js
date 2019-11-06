import {
  Client as ElasticSearchClient,
  Connection as DefaultConnection,
} from '@elastic/elasticsearch';
import AwsConnection from './aws/AwsElasticSearchConnection';

class ElasticSearchService {
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

    this.client = new ElasticSearchClient({
      ...this.options,
      Connection,
    });

    return this;
  }

  search(body) {
    return new Promise((resolve, reject) => {
      const param = {
        index: this.index,
        type: this.type,
        body,
      };
      this.client.search(param, (err, response) => {
        if (err) {
          reject(err);
        }

        this.result = response;

        resolve(response);
      });
    });
  }

  /**
   * @param {*} index
   * @param {*} settings
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
      include_type_name: true,
      body: settings,
    };

    return new Promise((resolve, reject) => {
      this.client.indices.create(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? reject(err) : resolve(response);
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
        err ? reject(err) : resolve(response);
      });
    });
  }

  indexOrCreateById(body) {
    const params = {
      index: this.index,
      type: this.type,
      id: body.id,
      body,
    };

    return new Promise((resolve, reject) => {
      this.client.index(params, (err, response) => {
        // eslint-disable-next-line no-unused-expressions
        err ? reject(err) : resolve(response);
      });
    });
  }

  bulkIndex(bodies) {
    return new Promise((resolve, reject) => {
      this.client.bulk(
        { body: this.constructBulkIndex(bodies) },
        (err, response) => {
          // eslint-disable-next-line no-unused-expressions
          err ? reject(err) : resolve(response);
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
        err ? reject(err) : resolve(response);
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
        err ? reject(err) : resolve(response);
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
      bulk.push({
        index: {
          _index: this.index,
          _type: this.type,
          _id: body.id,
        },
      });
      bulk.push(body);
    });

    return bulk;
  }
}

export default ElasticSearchService;
