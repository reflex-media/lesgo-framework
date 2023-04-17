import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import LesgoException from '../exceptions/LesgoException';
import isEmpty from '../utils/isEmpty';
import logger from '../utils/logger';
import createAwsConnector from '../utils/createAwsConnector';

const FILE = 'lesgo/services/OpenSearch';

export default class OpenSearchService {
  constructor(opts = {}) {
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

    const awsConnector = createAwsConnector(credentials, this.opts.region);

    return new Client({
      ...awsConnector,
      node: this.opts.host,
    });
  }

  async createIndex() {
    const client = await this.getClient();
    logger.debug(`${FILE}::CREATE_INDEX_CLIENT`, { client });

    const params = {
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

    try {
      const resp = await client.indices.create(params);
      logger.debug(`${FILE}::CREATE_INDEX_CREATED`, { resp, params });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to create index',
        `${FILE}::ERROR_CREATE_INDEX`,
        500,
        { err, params }
      );
    }
  }

  /**
   * Add or update document to index
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
  async indexDocument(documentId, data) {
    const client = await this.getClient();

    const param = {
      id: documentId,
      index: this.opts.index.name,
      body: {
        ...data,
        lastIndexedAt: Date.now(),
      },
      refresh: true,
    };

    try {
      const resp = await client.index(param);
      logger.debug(`${FILE}::ADD_DOCUMENT_ADDED`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to add document',
        `${FILE}::ERROR_ADD_DOCUMENT`,
        500,
        { err, param }
      );
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
  async searchIndex(query) {
    const client = await this.getClient();

    const param = {
      index: this.opts.index.name,
      body: {
        query,
      },
    };

    try {
      const resp = await client.search(param);
      logger.debug(`${FILE}::SEARCH_RESULT`, { resp, param });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to search document',
        `${FILE}::ERROR_SEARCH`,
        500,
        { err, param }
      );
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
      throw new LesgoException(
        'Failed to delete document',
        `${FILE}::ERROR_DELETE_DOCUMENT`,
        500,
        { err, client }
      );
    }
  }

  async deleteIndex() {
    const client = await this.getClient();
    logger.debug(`${FILE}::DELETE_INDEX_CLIENT`, { client });

    const params = {
      index: this.opts.index.name,
    };

    try {
      const resp = await client.indices.delete(params);
      logger.debug(`${FILE}::DELETE_INDEX_DELETED`, { resp, params });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to delete index',
        `${FILE}::ERROR_DELETE_INDEX`,
        500,
        { err, params }
      );
    }
  }
}
