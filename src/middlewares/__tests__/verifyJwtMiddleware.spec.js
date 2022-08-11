import config from 'Config/jwt'; // eslint-disable-line import/no-unresolved
import verifyJwtMiddleware, {
  verifyJwtMiddlewareBeforeHandler,
} from '../verifyJwtMiddleware';

describe('MiddlewareGroup: test verifyJwtMiddleware middleware', () => {
  const handler = {
    event: {
      headers: {},
      queryStringParameters: null,
      body: null,
    },
  };

  it('should return before object', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
        },
      },
    };
    const result = verifyJwtMiddleware(newHandler, () => {});

    expect(result).toHaveProperty('before');
  });

  it('test without authorization header', async () => {
    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(handler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual('Authorization Header is required!');
      expect(e.code).toEqual('JWT_MISSING_AUTHORIZATION_HEADER');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with missing bearer token', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization: '',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual('Authorization Header is required!');
      expect(e.code).toEqual('JWT_MISSING_AUTHORIZATION_HEADER');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with invalid token', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization: 'asdasd',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual('Missing Bearer token!');
      expect(e.code).toEqual('JWT_MISSING_BEARER_TOKEN');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with malformed token', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization: 'Bearer sdawdasdawdawdsd',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual('jwt malformed');
      expect(e.code).toEqual('JWT_ERROR');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with incorrect secret key', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual('invalid signature');
      expect(e.code).toEqual('JWT_ERROR');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with invalid ISS', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.2r0UHtMWMcLH3VJVDtVGP2_MT8npWy-w2lsUiZSBFFI',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual("Token's [iss] is not valid!");
      expect(e.code).toEqual('JWT_ISS_NOT_VALID');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with missing custom claim', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIn0.grz7RVA9XuOj4TUKLefvblt6bnSz0yfFpwee1MgMnN0',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(
        `Token's custom claim [${config.customClaims.data[0]}] not found!`
      );
      expect(e.code).toEqual('JWT_CUSTOM_CLAIM_NOT_FOUND');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with expired token', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZXhwIjoxNTE2MjM5MDIyfQ.-S3Ym5HiC5GPiW1Zjjt4j6L-skqP4PVV5f4fIScgPTE',
        },
      },
    };

    try {
      expect(
        await verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
      ).toThrow();
    } catch (e) {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual('jwt expired');
      expect(e.code).toEqual('JWT_EXPIRED');
      expect(e.statusCode).toEqual(403);
    }
  });

  it('test with valid token', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
        },
      },
    };

    await verifyJwtMiddlewareBeforeHandler(newHandler, () => {});
    expect(newHandler.event.decodedJwt).toMatchObject({
      sub: '1234567890',
      iss: config.iss.data[0],
    });
  });

  it('test with secret as a function argument', async () => {
    const { secret } = config;
    config.secret = () => {
      return '1111';
    };
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.7RdbXJhzrn_yV7CPqkuX0Yvtms0xaIw1q4LPe8O0BDY',
        },
      },
    };

    await verifyJwtMiddlewareBeforeHandler(newHandler, () => {});
    expect(newHandler.event.decodedJwt).toMatchObject({
      sub: '1234567890',
      iss: config.iss.data[0],
    });

    config.secret = secret;
  });

  it('test with callback argument', async () => {
    const callback = jest.fn();
    config.callback = callback;
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
        },
      },
    };

    await verifyJwtMiddlewareBeforeHandler(newHandler, () => {});
    expect(newHandler.event.decodedJwt).toMatchObject({
      sub: '1234567890',
      iss: config.iss.data[0],
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('test with custom config', async () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
        },
      },
    };

    await verifyJwtMiddlewareBeforeHandler(newHandler, () => {}, {
      jwtConfig: {
        secret:
          'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
        iss: {
          validate: true,
          data: ['domain.com'],
        },
        customClaims: {
          validate: true,
          data: ['department_id'],
        },
      },
    });
    expect(newHandler.event.decodedJwt).toMatchObject({
      sub: '1234567890',
      iss: config.iss.data[0],
    });
  });
});
