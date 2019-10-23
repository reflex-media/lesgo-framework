import SequelDatabase from 'sequelize';

export default class DatabaseService {
  constructor(options) {
    this.options = options;

    this.initialize();
  }

  initialize() {
    this.sequelize = new SequelDatabase(this.options);
  }

  healthCheck() {
    return this.sequelize.authenticate();
  }
}
