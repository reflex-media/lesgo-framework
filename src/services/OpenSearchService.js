import { Client, Connection } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import aws4 from 'aws4';
import LesgoException from '../exceptions/LesgoException';
import isEmpty from '../utils/isEmpty';
import logger from '../utils/logger';
import getCurrentTimestamp from '../utils/getCurrentTimestamp';

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
    const { region, host } = opts;

    if (isEmpty(region)) {
      throw new LesgoException(
        'Missing required parameter region',
        `${FILE}_MISSING_PARAMETER_REGION`,
        500,
        { opts }
      );
    }

    if (isEmpty(host)) {
      throw new LesgoException(
        'Missing required parameter host',
        `${FILE}_MISSING_PARAMETER_HOST`,
        500,
        { opts }
      );
    }

    this.opts = opts;
  }

  async getClient() {
    const credentials = await defaultProvider()();
    logger.debug(`${FILE}::GETCLIENT_CREDENTIALS`, { credentials });

    return new Client({
      ...createAwsConnector(credentials, this.opts.region),
      node: this.opts.host,
    });
  }

  async createIndex() {
    const client = await this.getClient();
    logger.debug(`${FILE}::CREATE_INDEX_CLIENT`, { client });

    let params = {
      index: this.opts.index.name,
      body: {
        settings: {
          index: {
            number_of_shards: this.opts.index.numShards,
            number_of_replicas: this.opts.index.numReplicas,
          },
        },
        mappings: {
          ...this.opts.index.mappings,
          properties: {
            ...this.opts.index.mappings.properties,
            lastIndexedAt: { type: 'date' },
          },
        },
      },
    };
    logger.debug(`${FILE}::CREATEINDEX_PARAMS`, { params });

    try {
      const resp = await client.indices.create(params);
      logger.debug(`${FILE}::CREATE_INDEX_CREATED`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to create index', `${FILE}::ERROR_CREATE_INDEX`, 500, { err });
    }
  }

  /**
   * Add document to index
   * 
   * @param {number|string} documentId 
   * @param {object} data 
   * 
   * const data = {
   *   name: 'John Doe',
   *   gender: 'male',
   *   profile: {
   *     aboutMe: 'Hi, I love to code!',
   *     headline: 'Do best at what you do',
   *     favoriteMovies: [
   *       {
   *         title: 'John Wick: Chapter 4',
   *         director: 'Chad Stahelski',
   *         genre: ['action', 'thriller'],
   *       },
   *       {
   *         title: 'Spider-Man: No Way Home',
   *         director: 'Jon Watts',
   *         genre: ['action', 'comedy'],
   *       },
   *     ],
   *   },
   *   location: {
   *     formattedAddress: '4775 W Harmon Ave Suite A, Las Vegas, NV 89103, USA',
   *     city: 'Las Vegas',
   *     state: 'Nevada',
   *     country: 'United States',
   *     lat: 36.1066296,
   *     lng: -115.2080718,
   *   },
   *   createdAt: 1681354668,
   *   updatedAt: 1681354668,
   * }
   */
  async addDocument(documentId, data) {
    const client = await this.getClient();

    try {
      const resp = await client.index({
        id: documentId,
        index: this.opts.index.name,
        body: {
          ...data,
          lastIndexedAt: Date.now(),
        },
        refresh: true
      });
      logger.debug(`${FILE}::ADD_DOCUMENT_ADDED`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to add document', `${FILE}::ERROR_ADD_DOCUMENT`, 500, { err, client });
    }
  }

  /**
   * Searches the index
   * 
   * @param {object} query
   * 
   * // Search for name: John Doe
   * const query = {
   *  query: {
   *    match: {
   *      name: {
   *        query: 'John Doe',
   *      },
   *    },
   *  },
   * };
   */
  async search(query) {
    const client = await this.getClient();

    const param = {
      index: this.index,
      body: query,
    };

    try {
      const resp = await client.search(param);
      logger.debug(`${FILE}::SEARCH_RESULT`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to search document', `${FILE}::ERROR_SEARCH`, 500, { err, client });
    }
  }

  async deleteDocument(documentId) {
    const client = await this.getClient();

    try {
      const resp = await client.delete({
        index: this.opts.index.name,
        id: documentId,
      });
      logger.debug(`${FILE}::DELETE_DOCUMENT_DELETED`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to delete document', `${FILE}::ERROR_DELETE_DOCUMENT`, 500, { err, client });
    }
  }

  async deleteIndex() {
    const client = await this.getClient();
    logger.debug(`${FILE}::DELETE_INDEX_CLIENT`, { client });

    const params = {
      index: this.opts.index.name,
    };
    logger.debug(`${FILE}::DELETE_INDEX_PARAMS`, { params });

    try {
      const resp = await client.indices.delete(params);
      logger.debug(`${FILE}::DELETE_INDEX_DELETED`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException('Failed to delete index', `${FILE}::ERROR_DELETE_INDEX`, 500, { err });
    }
  }
}
