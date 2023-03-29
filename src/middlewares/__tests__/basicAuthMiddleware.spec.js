import basicAuthMiddleware, {
  generateBasicAuthorizationHash,
  verifyBasicAuthBeforeHandler,
} from '../basicAuthMiddleware';
import client from '../../../tests/__mocks__/config/client'; // eslint-disable-line jest/no-mocks-import

describe('test generateBasicAuthorizationHash', () => {
  test('should return custom when overriden through opts', () => {
    expect(
      generateBasicAuthorizationHash(
        'e5bb52b012ad4a4e9d862a3410e7013d',
        '4cd19af8f7ca4448bcb2c427754095b5',
        {
          getPreHashString: key => {
            return `=${key}=`;
          },
        }
      )
    ).toBe('PWU1YmI1MmIwMTJhZDRhNGU5ZDg2MmEzNDEwZTcwMTNkPQ==');
  });

  test('should return basic auth by default', () => {
    const { getPreHashString } = client;
    client.getPreHashString = null;

    expect(
      generateBasicAuthorizationHash(
        'e5bb52b012ad4a4e9d862a3410e7013d',
        '4cd19af8f7ca4448bcb2c427754095b5'
      )
    ).toBe(
      'ZTViYjUyYjAxMmFkNGE0ZTlkODYyYTM0MTBlNzAxM2Q6NGNkMTlhZjhmN2NhNDQ0OGJjYjJjNDI3NzU0MDk1YjU='
    );

    client.getPreHashString = getPreHashString;
  });
});

describe('test basicAuthMiddleware middleware', () => {
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
    const result = basicAuthMiddleware({
      client: clientObj,
    });

    expect(result).toHaveProperty('before');
  });
});

// eslint-disable-next-line
const next = () => {};

describe('test verifyBasicAuthBeforeHandler error handling', () => {
  const invalidClientKey = Buffer.from('client_key:secret_key').toString(
    'base64'
  );
  const invalidSecretKey = Buffer.from(
    `${client.clients.platform_2.key}:secret_key`
  ).toString('base64');

  test.each`
    headers                                           | errorName           | errorMessage                                  | errorStatusCode | errorCode                                                               | platform
    ${{}}                                             | ${'LesgoException'} | ${'Authorization header not found'}           | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTHORIZATION_HEADER_NOT_FOUND'}    | ${undefined}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Invalid authorization type provided'}      | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_AUTHORIZATION_TYPE'}   | ${undefined}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${undefined}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${undefined}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${undefined}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${undefined}
    ${{}}                                             | ${'LesgoException'} | ${'Authorization header not found'}           | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTHORIZATION_HEADER_NOT_FOUND'}    | ${'platform_1'}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Invalid authorization type provided'}      | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_AUTHORIZATION_TYPE'}   | ${'platform_1'}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${'platform_1'}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'platform_1'}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'platform_1'}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'platform_1'}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Invalid authorization type provided'}      | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_AUTHORIZATION_TYPE'}   | ${'blacklist_platform'}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${'blacklist_platform'}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'blacklist_platform'}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'blacklist_platform'}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'blacklist_platform'}
    ${{ Authorization: 'auth' }}                      | ${'LesgoException'} | ${'Invalid authorization type provided'}      | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_AUTHORIZATION_TYPE'}   | ${'blacklist_platform_1'}
    ${{ Authorization: 'basic ' }}                    | ${'LesgoException'} | ${'Empty basic authentication hash provided'} | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_EMPTY_BASIC_HASH'}             | ${'blacklist_platform_1'}
    ${{ Authorization: `basic ${invalidClientKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'blacklist_platform_1'}
    ${{ Authorization: `basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'blacklist_platform_1'}
    ${{ Authorization: `Basic ${invalidSecretKey}` }} | ${'LesgoException'} | ${'Invalid client key or secret provided'}    | ${403}          | ${'Middlewares/basicAuthMiddleware::AUTH_INVALID_CLIENT_OR_SECRET_KEY'} | ${'blacklist_platform_1'}
  `(
    'should throw $errorMessage when authorization header is $headers',
    async ({
      headers,
      errorName,
      errorMessage,
      errorStatusCode,
      errorCode,
      platform,
    }) => {
      const handler = {
        event: {
          headers,
          platform: {
            id: platform,
            ...client.clients[platform],
          },
        },
      };

      let errObj = {};
      try {
        expect(await verifyBasicAuthBeforeHandler(handler, next)).toThrow();
      } catch (error) {
        errObj = { ...error };
      } finally {
        expect(errObj.name).toBe(errorName);
        expect(errObj.message).toBe(errorMessage);
        expect(errObj.statusCode).toBe(errorStatusCode);
        expect(errObj.code).toBe(errorCode);
      }
    }
  );
});

describe('test verifyBasicAuthBeforeHandler with valid credentials', () => {
  const validBasicAuth = generateBasicAuthorizationHash(
    client.clients.platform_2.key,
    client.clients.platform_2.secret
  );

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
  `('should return undefined when successful', async ({ clientObj }) => {
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
      await verifyBasicAuthBeforeHandler(handler, next, {
        client: clientObj,
      });
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBeFalsy();
  });

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
  `('should return undefined when successful', async ({ clientObj }) => {
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
      await verifyBasicAuthBeforeHandler(handler, next, {
        client: clientObj,
      });
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBeFalsy();
  });

  test.each`
    Authorization                | platform
    ${undefined}                 | ${'blacklist_platform'}
    ${undefined}                 | ${'blacklist_platform_1'}
    ${`basic ${validBasicAuth}`} | ${'platform_2'}
    ${`Basic ${validBasicAuth}`} | ${'platform_2'}
    ${`basic ${validBasicAuth}`} | ${'platform_2'}
    ${`Basic ${validBasicAuth}`} | ${'platform_2'}
  `(
    // FIXME: for the eslint error
    'test Exception with valid credentials', // eslint-disable-line jest/valid-title
    async ({ Authorization, platform }) => {
      const handler = {
        event: {
          headers: {
            Authorization,
          },
          platform: {
            id: platform,
            ...client.clients[platform],
          },
        },
      };

      let hasError = false;

      try {
        await verifyBasicAuthBeforeHandler(handler, next);
      } catch (e) {
        hasError = true;
      }

      expect(hasError).toBeFalsy();
    }
  );

  test.each`
    siteObjects
    ${{ platform: {
    id: 'platform_2',
    ...client.clients.platform_2,
  } }}
    ${{}}
  `('valid site ids', async ({ siteObjects }) => {
    const handler = {
      event: {
        headers: {
          Authorization: `basic ${validBasicAuth}`,
        },
        ...siteObjects,
      },
    };

    let hasError = false;

    try {
      await verifyBasicAuthBeforeHandler(handler, next);
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBeFalsy();
  });
});
