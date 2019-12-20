import mysql from 'serverless-mysql';

export default class MySQLDbService {
  constructor(options = null) {
    let mydb = null;

    if (options !== null) {
      const { host, port, database, user, password } = options.connection;

      mydb = mysql({
        config: {
          host,
          port,
          database,
          user,
          password,
        },
      });
    } else {
      mydb = mysql();
    }

    this.mysql = mydb;
    this.query = this.mysql.query;
    this.end = this.mysql.end;
  }

  connect(config) {
    const { host, port, database, user, password } = config;

    this.mysql.config({
      host,
      port,
      database,
      user,
      password,
    });
  }
}
