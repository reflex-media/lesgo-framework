import Knex from './knex';

export default class DatabaseService {
  constructor(options) {
    this.options = options;

    this.query = new Knex(this.options);
    this.knex = this.query;
  }
}
