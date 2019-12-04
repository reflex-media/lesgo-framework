/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import AWS from 'aws-sdk';
import {
  initialize,
  handleSuccess,
  handleFail,
  sendRequest,
  signedRequest,
} from '../aws/SignedRequest';

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

const wrongHttpResp = {
  statusCode: 0,
  on: (key, cb) => {
    if (key === 'data') {
      cb('notJsonFormat');
    } else if (key === 'end') {
      cb();
    }
  },
};

// mock the process.nextTick
process.nextTick = jest.fn().mockImplementation(cb => {
  cb();
});

describe('ServicesGroup: test SignedRequest', () => {
  it('test handleSuccess', () => {
    httpResp.statusCode = 200;
    handleSuccess(httpResp, true, (key, body) => {});
    handleSuccess(httpResp, false, (key, body) => {});
    httpResp.statusCode = 500;
    handleSuccess(httpResp, false, (key, body) => {});

    // should throw error 'Invalid JSON response'
    wrongHttpResp.statusCode = 200;
    handleSuccess(wrongHttpResp, false, (key, body) => {});
    wrongHttpResp.statusCode = 500;
    handleSuccess(wrongHttpResp, false, (key, body) => {});
  });

  it('test handleFail', () => {
    const cb = error => {
      console.log(error);
    };
    handleFail('mockingErrorAsString', cb);
    handleFail(new Error('mockingErrorAsInstance'), cb);
  });

  it('test initialize', () => {
    initialize(AWS, {
      awsCreds: null,
    });
  });

  it('test sendRequest', () => {
    sendRequest({ rawResponse: false, method: 'POST' }, () => {});
  });

  it('test signedRequest', () => {
    // null params
    signedRequest(AWS, {}).send(null, () => {});

    // no method params
    signedRequest(AWS, {}).send({}, () => {});

    // with method params
    // no AWS
    signedRequest(AWS, {}).send(
      {
        method: 'POST',
      },
      () => {}
    );
  });
});
