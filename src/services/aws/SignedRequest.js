/**
 * Create the utility that sends signed request
 *
 * @ref
 *    https://github.com/guardian/aws-signed-request
 *    https://github.com/TheDeveloper/http-aws-es
 *    https://github.com/elastic/elasticsearch-js
 *
 * @param {aws-sdk} AWS sdk
 * @param {Object} config Configuration containing
 *    * endpoint: AWS endpoint
 *    * region: AWS region
 *    * service: AWS service
 *    * rawResponse: Will return rawResponse from httprequest
 *    * awsCreds: Aws crendential to use. default to AWS default
 *    * region: AWS region
 * @return {Object} Utility with method `send`
 */
module.exports = (AWS, config) => {
  const awsEndpoint = new AWS.Endpoint(config.endpoint);
  const awsCreds = config.awsCreds || new AWS.EnvironmentCredentials('AWS');
  const { service } = config;
  const { region } = config;

  function handleSuccess(httpResp, asPlainText, callback) {
    let respBody = '';
    httpResp.on('data', chunk => {
      respBody += chunk;
    });
    httpResp.on('end', () => {
      if (httpResp.statusCode >= 200 && httpResp.statusCode < 400) {
        if (asPlainText) {
          process.nextTick(() => {
            callback(null, respBody);
          });
        } else {
          try {
            const parsedRespBody = JSON.parse(respBody);
            process.nextTick(() => {
              callback(null, parsedRespBody);
            });
          } catch (ex) {
            const error = new Error('Invalid JSON response');
            error.responseText = respBody;
            process.nextTick(() => {
              callback(error);
            });
          }
        }
      } else {
        let errorMessage;
        try {
          const errorResponse = JSON.parse(respBody);
          errorMessage = errorResponse.Message;
        } catch (ex) {
          errorMessage = respBody;
        }
        process.nextTick(() => {
          const error = new Error(errorMessage);
          error.responseText = respBody;
          callback(error);
        });
      }
    });
  }

  function handleFail(err, callback) {
    const error = typeof err === 'string' ? new Error(err) : err;
    process.nextTick(() => {
      callback(error);
    });
  }

  function sendRequest(params, callback) {
    const req = new AWS.HttpRequest(awsEndpoint);
    const rawResponse = params.rawResponse || false;

    req.method = params.method.toUpperCase();
    req.path = params.path;
    req.region = region;
    req.headers = params.headers || {};
    req.headers['presigned-expires'] = false;
    req.headers.Host = awsEndpoint.host;

    if (params.message) {
      req.body =
        typeof params.message === 'string'
          ? params.message
          : JSON.stringify(params.message);
    }

    const signer = new AWS.Signers.V4(req, service);
    signer.addAuthorization(awsCreds, new Date());

    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      req,
      AWS.config.httpOptions,
      httpResp => {
        // eslint-disable-next-line no-unused-expressions
        rawResponse
          ? callback(null, httpResp)
          : handleSuccess(httpResp, params.json === false, callback);
      },
      err => {
        // eslint-disable-next-line no-unused-expressions
        rawResponse ? callback(err) : handleFail(err, callback);
      }
    );
  }

  return {
    /**
     * Send a request
     * @param {Object} params Object containing
     *    * method: HTTP method (e.g GET, POST)
     *    * path: Request path (e.g. '/_cat/indices')
     *    * message: Request body (String or JSON)
     *    * json: Boolean, whether the response from the server should be parsed as JSON
     * @return {[type]} [description]
     */
    send(params, callback) {
      if (!params) {
        process.nextTick(() => {
          callback(new TypeError('Missing or invalid parameters'));
        });
      } else if (!params.method) {
        process.nextTick(() => {
          callback(new TypeError('Missing method'));
        });
      } else {
        try {
          sendRequest(params, callback);
        } catch (ex) {
          process.nextTick(() => {
            callback(ex);
          });
        }
      }
    },
  };
};
