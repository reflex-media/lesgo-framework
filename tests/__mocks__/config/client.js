export default {
  /*
   *--------------------------------------------------------------------------
   * Default Header value
   *--------------------------------------------------------------------------
   *
   * Here you may specify what header key to use to pass for client identificaiton.
   */
  headerKeys: ['x-client-id', 'X-Client-Id'],

  /*
   *--------------------------------------------------------------------------
   * Callback on Success
   *--------------------------------------------------------------------------
   *
   * Here you may call a callback after a successful verification is confirmed
   */
  callback: h => {
    // eslint-disable-next-line no-param-reassign
    h.event.created_obj = 'created_obj';
  },

  /*
   *--------------------------------------------------------------------------
   * Clients
   *--------------------------------------------------------------------------
   *
   * Here are each of the clients setup to have access to your application.
   * `key` property is used for external identification, while the key is used for internal.
   * Both `key` and `secret` are used for Basic authentication.
   *
   * `isAuthOptional` propoerty can be passed as well, which skips authentication whenever basic auth is not provided,
   * and only throws an authentication error when a basic auth is provided with incorrect credentials
   *
   * Other user-defined propoerties can defined as well for access when a match exists
   * ```
   * import client from 'Config/client';
   *
   * console.log(client[handler.event.platform]);
   * ```
   */
  clients: {
    platform_1: {
      key: '1111-1111-1111-1111',
      secret: '1111-1111-1111-1111',
    },
    platform_2: {
      key: '2222-2222-2222-2222',
      secret: '2222-2222-2222-2222',
    },
    platform_3: {
      key: '3333-3333-3333-3333',
      secret: '3333-3333-3333-3333',
    },
    platform_4: {
      key: '4444-4444-4444-4444',
      secret: '4444-4444-4444-4444',
    },
    platform_5: {
      key: '5555-5555-5555-5555',
      secret: '5555-5555-5555-5555',
    },
    platform_6: {
      key: '6666-6666-6666-6666',
      secret: '6666-6666-6666-6666',
    },
    blacklist_platform: {
      key: '7777-7777-7777-7777',
      isAuthOptional: true,
    },
  },
};
