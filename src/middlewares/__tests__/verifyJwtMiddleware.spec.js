import config from 'Config/jwt'; // eslint-disable-line import/no-unresolved
import { verifyJwtMiddlewareBeforeHandler } from '../verifyJwtMiddleware';
import LesgoException from '../../exceptions/LesgoException';

describe('MiddlewareGroup: test verifyJwtMiddleware middleware', () => {
  const handler = {
    event: {
      headers: {},
      queryStringParameters: null,
      body: null,
    },
  };

  it('test without authorization header', () => {
    expect(() => verifyJwtMiddlewareBeforeHandler(handler, () => {})).toThrow(
      new LesgoException(
        'Authorization Header is required!',
        'JWT_MISSING_AUTHORIZATION_HEADER',
        403
      )
    );
  });

  it('test with missing bearer token', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization: '',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(
      new LesgoException(
        'Authorization Header is required!',
        'JWT_MISSING_AUTHORIZATION_HEADER',
        403
      )
    );
  });

  it('test with invalid token', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization: 'asdasd',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(
      new LesgoException(
        'Missing Bearer token!',
        'JWT_MISSING_BEARER_TOKEN',
        403
      )
    );
  });

  it('test with malformed token', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization: 'Bearer sdawdasdawdawdsd',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(new LesgoException('jwt malformed', 'JWT_ERROR', 403));
  });

  it('test with incorrect secret key', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(new LesgoException('invalid signature', 'JWT_ERROR', 403));
  });

  it('test with invalid ISS', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.2r0UHtMWMcLH3VJVDtVGP2_MT8npWy-w2lsUiZSBFFI',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(
      new LesgoException(
        "Token's [iss] is not valid!",
        'JWT_ISS_NOT_VALID',
        403
      )
    );
  });

  it('test with missing custom claim', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIn0.grz7RVA9XuOj4TUKLefvblt6bnSz0yfFpwee1MgMnN0',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(
      new LesgoException(
        `Token's custom claim [${config.customClaims.data[0]}] not found!`,
        'JWT_CUSTOM_CLAIM_NOT_FOUND',
        403
      )
    );
  });

  it('test with expired token', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZXhwIjoxNTE2MjM5MDIyfQ.-S3Ym5HiC5GPiW1Zjjt4j6L-skqP4PVV5f4fIScgPTE',
        },
      },
    };

    expect(() =>
      verifyJwtMiddlewareBeforeHandler(newHandler, () => {})
    ).toThrow(new LesgoException('jwt expired', 'JWT_EXPIRED', 403));
  });

  it('test with valid token', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
        },
      },
    };

    verifyJwtMiddlewareBeforeHandler(newHandler, () => {});
    expect(newHandler.event.decodedJwt).toMatchObject({
      sub: '1234567890',
      iss: config.iss.data[0],
    });
  });

  it('test with custom config', () => {
    const newHandler = {
      event: {
        ...handler.event,
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
        },
      },
    };

    verifyJwtMiddlewareBeforeHandler(newHandler, () => {}, {
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
