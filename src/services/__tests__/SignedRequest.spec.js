/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { handleSuccess, handleFail, sendRequest } from '../aws/SignedRequest';

const httpResp = {
  statusCode: 0,
  on: (key, cb) => {
    if (key === 'data') {
      cb('{"data": "mockedData"}');
    } else if (key === 'end') {
      cb();
    }
  },
};

describe('ServicesGroup: test SignedRequest', () => {
  it('test handleSuccess', () => {
    httpResp.statusCode = 200;
    handleSuccess(httpResp, true, (key, body) => {});
    handleSuccess(httpResp, false, (key, body) => {});
    httpResp.statusCode = 500;
    handleSuccess(httpResp, false, (key, body) => {});

    // should throw error 'Invalid JSON response'
    handleSuccess(
      {
        statusCode: 200,
        on: (key, cb) => {
          if (key === 'data') {
            cb('notJsonFormat');
          } else if (key === 'end') {
            cb();
          }
        },
      },
      false,
      (key, body) => {}
    );
  });

  it('test handleFail', () => {
    const cb = error => {
      console.log(error);
    };
    handleFail('mockingErrorAsString', cb);
    handleFail(new Error('mockingErrorAsInstance'), cb);
  });
});
