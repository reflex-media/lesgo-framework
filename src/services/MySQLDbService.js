import mysql from 'serverless-mysql';

export default class MySQLDbService {
  constructor(options = null) {
    let mydb = null;

    if (options !== null) {
      const { host, database, user, password } = options.connection;

      mydb = mysql({
        config: {
          host,
          database,
          user,
          password,
        },
      });
    } else {
      mydb = mysql();
    }

    this.db = mydb;
    this.config = this.db.config;
    this.query = this.db.query;
    this.end = this.db.end;
  }

  connect(options) {
    const { host, database, user, password } = options.connection;

    this.db.config({
      host,
      database,
      user,
      password,
    });
  }
}
