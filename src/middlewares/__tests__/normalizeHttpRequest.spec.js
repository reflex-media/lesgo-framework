import {
  normalizeRequest,
  normalizeHttpRequestBeforeHandler,
} from '../normalizeHttpRequest';

describe('test normalizeRequest', () => {
  it('test with default parameters', () => {
    const data = normalizeRequest({ headers: null, qs: null, body: null });
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

describe('test normalizeHttpRequestBeforeHandler', () => {
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
});
