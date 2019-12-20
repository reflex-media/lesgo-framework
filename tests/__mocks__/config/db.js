export default {
  default: 'mysql',
  connections: {
    mysql: {
      connection: {
        host: '127.0.0.1',
        host_read: '127.0.0.2',
        port: 3306,
        user: 'root',
        password: 'password',
        database: 'myapp_test',
        charset: 'utf8',
      },
    },
  },
};
