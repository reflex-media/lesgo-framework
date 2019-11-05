import AWS from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import { Connection } from '@elastic/elasticsearch';
import SignedRequest from './SignedRequest';

/* eslint-disable class-methods-use-this */
export default class AwsElasticSearchConnection extends Connection {
  constructor(opts) {
    super(opts);

    this.opts = opts;
  }

  setRegion(region) {
    this.region = region;
  }

  async request(params, cb) {
    try {
      const awsCreds = await this.getCredentials();

      const httpClient = SignedRequest(AWS, {
        endpoint: this.opts.url.host,
        region: this.region,
        service: 'es',
        awsCreds,
      });

      httpClient.send(
        {
          method: params.method,
          path: params.path,
          message: params.body,
          headers: params.headers,
          rawResponse: true, // @elastic search expect Raw Response
        },
        cb
      );
    } catch (err) {
      cb(err);
    }
  }

  getCredentials() {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      if (AWS.config.credentials === null) {
        return reject(new Error('Invalid AWS Credentials'));
      }

      AWS.config.getCredentials((err, creds) => {
        if (err) return reject(err);

        return resolve(creds);
      });
    });
  }
}
