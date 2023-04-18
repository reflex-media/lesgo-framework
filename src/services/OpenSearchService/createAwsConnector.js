import { Connection } from '@opensearch-project/opensearch';
import aws4 from 'aws4';

export default (credentials, region) => {
  class AmazonConnection extends Connection {
    buildRequestObject(params) {
      const request = super.buildRequestObject(params);
      request.service = 'es';
      request.region = region;
      request.headers = request.headers || {};
      request.headers.host = request.hostname;

      return aws4.sign(request, credentials);
    }
  }

  return {
    Connection: AmazonConnection,
  };
};
