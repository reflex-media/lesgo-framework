import app from 'Config/app'; // eslint-disable-line import/no-unresolved
import {
  normalizeRequest,
  normalizeHttpRequestBeforeHandler,
} from '../normalizeHttpRequestMiddleware';
import logger from '../../utils/logger';

describe('MiddlewareGroup: test normalizeRequest', () => {
  it('test with default parameters', () => {
    const data = normalizeRequest({ headers: null, qs: null, body: null });
    expect(data).toBe(null);
  });

  it('test with empty parameters from alb', () => {
    const data = normalizeRequest({ headers: null, qs: {}, body: null });
    expect(data).toBe(null);
  });

  it('test with empty header parameters', () => {
    const data = normalizeRequest({ headers: {}, qs: null, body: null });
    expect(data).toBe(null);
  });

  it('test with valid query string', () => {
    const data = normalizeRequest({
      headers: {},
      qs: { someKey: 'someValue', body: null },
    });
    expect(data).toMatchObject({ someKey: 'someValue' });
  });

  it('test with valid body and content-type', () => {
    const data = normalizeRequest({
      headers: { 'content-type': 'application/json' },
      qs: null,
      body: JSON.stringify({ someKey: 'someValue' }),
    });

    expect(data).toMatchObject({ someKey: 'someValue' });
  });

  it('test with valid body and Content-Type', () => {
    const data = normalizeRequest({
      headers: { 'Content-Type': 'application/json' },
      qs: null,
      body: JSON.stringify({ someKey: 'someValue' }),
    });

    expect(data).toMatchObject({ someKey: 'someValue' });
  });

  it('test with valid query string and body and Content-Type', () => {
    const data = normalizeRequest({
      headers: { 'Content-Type': 'application/json' },
      qs: { someKeyQS: 'someValueQS' },
      body: JSON.stringify({ someKeyBody: 'someValueBody' }),
    });

    expect(data).toMatchObject({
      someKeyQS: 'someValueQS',
      someKeyBody: 'someValueBody',
    });
  });

  it('test with invalid body and valid Content-Type', () => {
    expect(() => {
      normalizeRequest({
        headers: { 'Content-Type': 'application/json' },
        qs: null,
        body: {
          someKey: 'someValue',
        },
      });
    }).toThrow(
      new Error('Content type defined as JSON but an invalid JSON was provided')
    );
  });
});

describe('MiddlewareGroup: test normalizeHttpRequestBeforeHandler', () => {
  it('test with default parameters', () => {
    const handler = {
      event: {
        headers: {},
        queryStringParameters: null,
        body: null,
      },
    };

    normalizeHttpRequestBeforeHandler(handler, () => {});
    expect(handler.event.input).toBe(null);
  });

  it('test with request context', () => {
    const handler = {
      event: {
        headers: {},
        requestContext: {
          requestId: 'requestId',
        },
      },
    };

    normalizeHttpRequestBeforeHandler(handler, () => {});
  });

  it('should return auth.sub if Authorization exists', () => {
    const handler = {
      event: {
        headers: {
          Authorization:
            'eyJraWQiOiIzSHc3YmRuUHBIMnJSZWhjT3k5NFRLZm5ybzU0Y1RFUW1lcGtVYWc2bW1vPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMmI1MzQ5ZC1mNWUzLTQ0ZjUtOWMwOC1hZTZiMDFlOTU0MzQiLCJhdWQiOiI0aHM0a2ZpNTAwZWtkajJhZTdiOWExazU4byIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZXZlbnRfaWQiOiJlNzdiZGZmYy0wYjFjLTQzMzMtYWUxZS1lM2QwNjZkNzAyZGMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYxNTYxMTc3NywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xXzR3QjFuSmNvSyIsImNvZ25pdG86dXNlcm5hbWUiOiJmMmI1MzQ5ZC1mNWUzLTQ0ZjUtOWMwOC1hZTZiMDFlOTU0MzQiLCJleHAiOjE2MTU2MTUzNzcsImlhdCI6MTYxNTYxMTc3NywiZW1haWwiOiJzdWZpeWFuK3Rlc3RAaW5jdWJlOC5zZyJ9.hbNYnVt6_fhX5KJEfn6Fi9cOZkQAldHGitVBWXSd0_YcWDU_BJ1OVu_VFEKzIvaRLR_zy2eW3dIJ27pn1_6U0sS8MZMsvtz0SKQP4M1hTEnhb5TOSIcOs9Y6ZPy1e1ShIqQmq2j_K1JFzEZH7u3eOmCTmFcs8X5vUk8O1sT2KqBP5UCBVB_4rCVEjbRGdyynqEKcdKkd7Nk6v9onpxRbG3FOg6vlsKSlfZ6RIz3jbjO4ZkCJiYAgrI7bsh2VGwE8pZq80GuQy9pocLkTcZiAFcni50-yvePQX8tkXhPzbp7DibAI6nU87Ol6TW4ZmB-0BZ56Nfeowoe7tT-7hvGkGA',
        },
      },
    };

    normalizeHttpRequestBeforeHandler(handler, () => {});
    expect(handler.event.auth.sub).toBe('f2b5349d-f5e3-44f5-9c08-ae6b01e95434');
  });

  it.each`
    version  | tags
    ${'1.0'} | ${{ path: '/v1/path', httpMethod: 'GET' }}
    ${'2.0'} | ${{ path: '/v2/path', httpMethod: 'POST' }}
    ${'3.0'} | ${{ path: '/v2/path', httpMethod: 'POST' }}
  `(
    'should identify path and httpMethod based on version',
    ({ version, tags }) => {
      const handler = {
        event: {
          version,
          headers: {},
          path: '/v1/path',
          httpMethod: 'GET',
          requestContext: {
            http: {
              path: '/v2/path',
              method: 'POST',
            },
          },
        },
      };
      normalizeHttpRequestBeforeHandler(handler, () => {});
      expect(logger.meta.tags).toStrictEqual(tags);
    }
  );

  it('should not set tags when using API Gateway v2 and requestContext is empty', () => {
    const handler = {
      event: {
        version: '2.0',
        headers: {},
      },
    };

    normalizeHttpRequestBeforeHandler(handler, () => {});
    expect(logger.meta.tags).toStrictEqual({});
  });

  it('should not set meta on debug', () => {
    app.debug = true;
    const handler = {
      event: {
        headers: {},
        auth: '1',
        queryStringParameters: {
          foo: 'bar',
        },
        body: {
          test: 'body',
        },
      },
    };

    normalizeHttpRequestBeforeHandler(handler, () => {});
    expect(logger.meta.auth).toBe(handler.event.auth);
    expect(logger.meta.queryStringParameters).toStrictEqual(
      handler.event.queryStringParameters
    );
    expect(logger.meta.body).toStrictEqual(handler.event.body);
  });
});
