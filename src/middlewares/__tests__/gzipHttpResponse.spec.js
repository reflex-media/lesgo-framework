import {
  determineRequestAcceptEncoding,
  determineRequestOrigin,
  gzip,
  gzipHttpResponse,
} from '../gzipHttpResponse';

describe('test gzipHttpResponse determineRequestOrigin', () => {
  it('should return APIGATEWAY by default', () => {
    const handler = { event: { requestContext: {} } };

    expect(determineRequestOrigin(handler)).toEqual('APIGATEWAY');
  });

  it('should return ELB when requestContext has property elb', () => {
    const handler = { event: { requestContext: { elb: {} } } };

    expect(determineRequestOrigin(handler)).toEqual('ELB');
  });

  it('should return APIGATEWAY when requestContext has property apiId', () => {
    const handler = { event: { requestContext: { apiId: 'asd-123' } } };

    expect(determineRequestOrigin(handler)).toEqual('APIGATEWAY');
  });
});

describe('test gzipHttpResponse determineRequestAcceptEncoding', () => {
  it('should return false when no Accept-Encoding header exists', () => {
    const handler = { event: { headers: {} } };

    expect(determineRequestAcceptEncoding(handler)).toBeFalsy();
  });

  it('should return true when Accept-Encoding header exists with gzip', () => {
    const handler = { event: { headers: { 'Accept-Encoding': 'gzip' } } };

    expect(determineRequestAcceptEncoding(handler)).toBeTruthy();
  });

  it('should return true when Accept-encoding header exists with gzip', () => {
    const handler = { event: { headers: { 'Accept-encoding': 'gzip' } } };

    expect(determineRequestAcceptEncoding(handler)).toBeTruthy();
  });

  it('should return true when accept-encoding header exists with gzip', () => {
    const handler = { event: { headers: { 'accept-encoding': 'gzip' } } };

    expect(determineRequestAcceptEncoding(handler)).toBeTruthy();
  });

  it('should return true when Accept-Encoding header exists with Multiple algorithms containing gzip', () => {
    const handler = {
      event: { headers: { 'Accept-Encoding': 'deflate, gzip' } },
    };

    expect(determineRequestAcceptEncoding(handler)).toBeTruthy();
  });

  // FIXME: Currently this is not being handled
  // it('should return true when Accept-Encoding header exists with Multiple algorithms containing gzip, weighted with the quality value syntax', () => {
  //   const handler = {
  //     event: { headers: { 'Accept-Encoding': 'deflate, gzip;q=1.0, *;q=0.5' } },
  //   };

  //   expect(determineRequestAcceptEncoding(handler)).toBeTruthy();
  // });

  it('should return false when Accept-Encoding header exists with other than gzip', () => {
    const handler = { event: { headers: { 'Accept-Encoding': 'compress' } } };

    expect(determineRequestAcceptEncoding(handler)).toBeFalsy();
  });
});

describe('test gzipHttpResponse gzip', () => {
  it('should return gzipped data with necessary headers', async () => {
    const response = {
      body: JSON.stringify({ someKey: 'someValue' }),
    };
    // const gzippedBody = 'H4sIAAAAAAAAE6tWKs7PTfVOrVSyArPCEnNKU5VqASj48/MXAAAA';

    const resp = await gzip(response);
    // expect(resp.body).toEqual(gzippedBody);
    expect(resp.isBase64Encoded).toBeTruthy();
    expect(resp.headers['Content-Encoding']).toEqual('gzip');
  });

  it('should return zlib.gzip error when passing non-string object', async () => {
    const response = {
      body: { someKey: 'someValue' },
    };

    try {
      const resp = await gzip(response);
      expect(resp).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.code).toEqual('GZIP_LIB_ERROR');
    }
  });
});

describe('test gzipHttpResponse gzipHttpResponse', () => {
  it('should return gzipped response for ELB requests', async () => {
    const handler = {
      event: {
        headers: { 'accept-encoding': 'gzip' },
        requestContext: { elb: {} },
      },
      response: {
        body: JSON.stringify({ someKey: 'someValue' }),
      },
    };

    // const gzippedBody = 'H4sIAAAAAAAAE6tWKs7PTfVOrVSyArPCEnNKU5VqASj48/MXAAAA';

    const handlerResp = await gzipHttpResponse(handler);

    // expect(handlerResp.body).toEqual(gzippedBody);
    expect(handlerResp.isBase64Encoded).toBeTruthy();
    expect(handlerResp.headers['Content-Encoding']).toEqual('gzip');
  });

  it('should return non-gzipped response for API Gateway requests', async () => {
    const handler = {
      event: {
        headers: { 'accept-encoding': 'gzip' },
        requestContext: { apiId: 'asd-123' },
      },
      response: {
        body: JSON.stringify({ someKey: 'someValue' }),
      },
    };

    const handlerResp = await gzipHttpResponse(handler);

    expect(handlerResp.body).toEqual(handler.response.body);
    expect(handlerResp.isBase64Encoded).toBeUndefined();
    expect(handlerResp.headers).toBeUndefined();
  });

  it('should return gzipped response for ELB requests from options', async () => {
    const handler = {
      event: {
        headers: { 'accept-encoding': 'gzip' },
        requestContext: { elb: {} },
      },
      response: {
        body: JSON.stringify({ someKey: 'someValue' }),
      },
    };

    // const gzippedBody = 'H4sIAAAAAAAAE6tWKs7PTfVOrVSyArPCEnNKU5VqASj48/MXAAAA';

    const handlerResp = await gzipHttpResponse(handler, {
      zipWhenRequest: ['ELB'],
    });

    // expect(handlerResp.body).toEqual(gzippedBody);
    expect(handlerResp.isBase64Encoded).toBeTruthy();
    expect(handlerResp.headers['Content-Encoding']).toEqual('gzip');
  });

  it('should return non-gzipped response for ELB requests with custom non-elb option', async () => {
    const handler = {
      event: {
        headers: { 'accept-encoding': 'gzip' },
        requestContext: { elb: {} },
      },
      response: {
        body: JSON.stringify({ someKey: 'someValue' }),
      },
    };

    const handlerResp = await gzipHttpResponse(handler, {
      zipWhenRequest: ['apiId'],
    });

    expect(handlerResp.body).toEqual(handler.response.body);
    expect(handlerResp.isBase64Encoded).toBeUndefined();
    expect(handlerResp.headers).toBeUndefined();
  });
});
