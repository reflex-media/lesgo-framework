import serverAuthMiddleware, {
  serverAuthBeforeHandler,
} from '../serverAuthMiddleware';
import { generateBasicAuthorizationHash } from '../basicAuthMiddleware';
import client from '../../../tests/__mocks__/config/client';

describe('test serverAuthMiddleware middleware', () => {
  test.each`
    clientObj
    ${undefined}
    ${{}}
    ${{
  default: {
    key: '1111-1111-1111-1111',
    secret: '1111-1111-1111-1111',
  },
}}
  `('should return object', ({ clientObj }) => {
    const result = serverAuthMiddleware({
      client: clientObj,
    });

    expect(result).toHaveProperty('before');
    expect(result).toHaveProperty('onError');
  });
});

// eslint-disable-next-line
const next = () => {};

describe('test serverAuthBeforeHandler with valid credentials', () => {
  const validBasicAuth = Buffer.from(
    generateBasicAuthorizationHash(
      client.platform_2.key,
      client.platform_2.secret
    )
  ).toString('base64');

  test.each`
    clientObj
    ${undefined}
    ${{}}
    ${{
  platform_2: {
    key: '2222-2222-2222-2222',
    secret: '2222-2222-2222-2222',
  },
}}
  `('should return undefined when successful', ({ clientObj }) => {
    const handler = {
      event: {
        headers: {
          Authorization: `basic ${validBasicAuth}`,
        },
        site: {
          id: 'platform_2',
        },
      },
    };

    let hasError = false;

    try {
      serverAuthBeforeHandler(handler, next, {
        client: clientObj,
      });
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBeFalsy();
  });

  test.each`
    Authorization                | blacklistMode
    ${undefined}                 | ${false}
    ${`basic ${validBasicAuth}`} | ${false}
    ${`Basic ${validBasicAuth}`} | ${false}
    ${`basic ${validBasicAuth}`} | ${true}
    ${`Basic ${validBasicAuth}`} | ${true}
  `(
    'test Exception with valid credentials',
    ({ Authorization, blacklistMode }) => {
      const handler = {
        event: {
          headers: {
            Authorization,
          },
          site: {
            id: 'platform_2',
          },
        },
      };

      let hasError = false;

      try {
        serverAuthBeforeHandler(handler, next, {
          blacklistMode,
        });
      } catch (e) {
        hasError = true;
      }

      expect(hasError).toBeFalsy();
    }
  );
});

describe('test serverAuthBeforeHandler error handling', () => {
  const invalidClientKey = Buffer.from('client_key:secret_key').toString(
    'base64'
  );
  const invalidSecretKey = Buffer.from(
    `${client.platform_2.key}:secret_key`
  ).toString('base64');

  test.each`
    headers                                           | errorName           | errorMessage                                  | errorStatusCode | errorCode                                                               | blacklistMode
    ${{}}                                             | ${'LesgoException'} | ${'Authorization header not found'}           | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTHORIZATION_HEADER_NOT_FOUND'}    | ${undefined}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Missing Bearer token!'}                    | ${403}          | ${'JWT_MISSING_BEARER_TOKEN'}                                           | ${undefined}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${undefined}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${undefined}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${undefined}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${undefined}
    ${{}}                                             | ${'LesgoException'} | ${'Authorization header not found'}           | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTHORIZATION_HEADER_NOT_FOUND'}    | ${true}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Missing Bearer token!'}                    | ${403}          | ${'JWT_MISSING_BEARER_TOKEN'}                                           | ${true}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${true}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${true}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${true}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${true}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Missing Bearer token!'}                    | ${403}          | ${'JWT_MISSING_BEARER_TOKEN'}                                           | ${false}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${false}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${false}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${false}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${false}
  `(
    'should throw $errorMessage when authorization header is $headers',
    async ({
      headers,
      errorName,
      errorMessage,
      errorStatusCode,
      errorCode,
      blacklistMode,
    }) => {
      const handler = {
        event: {
          headers,
          site: {
            id: 'platform_1',
          },
        },
      };

      try {
        serverAuthBeforeHandler(handler, next, {
          blacklistMode,
        });
      } catch (error) {
        expect(error.name).toBe(errorName);
        expect(error.message).toBe(errorMessage);
        expect(error.statusCode).toBe(errorStatusCode);
        expect(error.code).toBe(errorCode);
      }
    }
  );
});
