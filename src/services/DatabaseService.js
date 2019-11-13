import { Model } from 'objection/lib/model/Model';
import Knex from './knex';

export default class DatabaseService {
  constructor(options) {
    this.options = options;
    this.knex = new Knex(this.options);

    Model.knex(this.knex);
  }

  options() {
    return this.options;
  }

  knex() {
    return this.knex;
  }

  // eslint-disable-next-line class-methods-use-this
  model() {
    return Model;
  }
}
