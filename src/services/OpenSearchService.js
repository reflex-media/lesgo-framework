import { Client, Connection } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import aws4 from 'aws4';
import LesgoException from '../exceptions/LesgoException';
import isEmpty from '../utils/isEmpty';

const FILE = 'lesgo/services/OpenSearch';

const createAwsConnector = (credentials, region) => {
  class AmazonConnection extends Connection {
    buildRequestObject(params) {
      const request = super.buildRequestObject(params);
      request.service = 'es';
      request.region = region;
      request.headers = request.headers || {};
      request.headers['host'] = request.hostname;

      return aws4.sign(request, credentials);
    }
  }

  return {
    Connection: AmazonConnection
  };
};

export default class OpenSearchService {
  constructor(opts) {
    const { region, host, index, type } = opts;

    if (isEmpty(region)) {
      throw new LesgoException(
        'Missing required parameter region',
        'OPENSEARCH_MISSING_PARAMETER_REGION',
        500,
        { opts }
      );
    }

    if (isEmpty(host)) {
      throw new LesgoException(
        'Missing required parameter host',
        'OPENSEARCH_MISSING_PARAMETER_HOST',
        500,
        { opts }
      );
    }

    this.opts = opts;
  }

  async getClient() {
    const credentials = await defaultProvider()();
    return new Client({
      ...createAwsConnector(credentials, this.opts.region),
      node: this.opts.host,
    });
  }

  async search() {
    const client = await this.getClient();

    const param = {
      index: this.index,
      type: this.type,
      body,
    };

    const response = await client.search(param);
    return response;
  }

  /**
     * @param {object} settings
     * @param {string} index
     *
     *  const settings = {
     *    index: {
     *       number_of_shards: 3,
     *       number_of_replicas: 2,
     *     },
     *   };
     */
  async createIndex(settings, index = null) {
    const client = await this.getClient();

    const params = {
      index: index || this.index,
      body: settings,
    };

    return client.indices.create(params);
  }
}
