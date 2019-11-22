import mysql from 'knex/lib/dialects/mysql';

export default {
  default: 'mysql',
  connections: {
    mysql: {
      client: mysql,
      connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'myapp_test',
        charset: 'utf8',
      },
    },
  },
};
