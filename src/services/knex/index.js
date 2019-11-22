/**
 * Modified version of [knex/lib/index.js]
 * Ignoring this file for now since it is a copy of knex.js.
 * However, will still be good to ensure this file is validated
 */

/* istanbul ignore file */

import Raw from 'knex/lib/raw';
import Client from 'knex/lib/client';
import QueryBuilder from 'knex/lib/query/builder';
import QueryInterface from 'knex/lib/query/methods';
import makeKnex from 'knex/lib/util/make-knex';
import fakeClient from 'knex/lib/util/fake-client';
import { SUPPORTED_CLIENTS } from 'knex/lib/constants';

class Knex {
  constructor(config) {
    let Dialect;

    if (arguments.length === 0 || (!config.client && !config.dialect)) {
      Dialect = Client;
    } else if (
      typeof config.client === 'function' &&
      SUPPORTED_CLIENTS.indexOf(config.client.prototype.dialect) !== -1
    ) {
      Dialect = config.client;
    } else {
      throw new Error('Provide an instance of the client');
    }

    const newKnex = makeKnex(new Dialect(config));

    if (config.userParams) {
      newKnex.userParams = config.userParams;
    }

    return newKnex;
  }
}

// Expose Client on the main Knex namespace.
Knex.Client = Client;
Knex.QueryBuilder = {
  extend: (methodName, fn) => {
    QueryBuilder.extend(methodName, fn);
    QueryInterface.push(methodName);
  },
};

// Run a "raw" query, though we can't do anything with it other than put
// it in a query statement.
Knex.raw = (sql, bindings) => {
  // eslint-disable-next-line no-console
  console.warn(
    'global Knex.raw is deprecated, use knex.raw (chain off an initialized knex object)'
  );

  return new Raw(fakeClient).set(sql, bindings);
};

export default Knex;
