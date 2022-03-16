import OpenSearchSupportDecorator from './OpenSearchSupportDecorator';

class OpenSearchService extends OpenSearchSupportDecorator {
  constructor({ index, type, connection, options }) {
    super({
      index,
      type,
      connection,
      options,
    });
  }
}

export default OpenSearchService;
