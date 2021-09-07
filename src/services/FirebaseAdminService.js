import * as firebaseAdmin from 'firebase-admin';
import logger from '../utils/logger';
import isEmpty from '../utils/isEmpty';
import LesgoException from '../exceptions/LesgoException';

const FILE = 'Lesgo/services/FirebaseAdminService';

export default class FirebaseAdmin {
  constructor(opts = {}) {
    this.app = null;
    this.connect(opts);
  }

  connect(opts) {
    const { serviceAccount, projectName } = opts;

    if (!serviceAccount || !projectName)
      throw new LesgoException(
        'Missing required parameters serviceAccount and or projectName',
        'FIREBASEADMIN_MISSING_PARAMETERS',
        500,
        { opts }
      );

    this.app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: `https://${projectName}.firebaseio.com`,
    });
  }

  async getAllUsers(maxResults, nextPageToken) {
    const max = !isEmpty(maxResults) ? maxResults : 25;

    try {
      logger.debug(`${FILE}::FETCHING_USERS`, {
        max,
        maxResults,
        nextPageToken,
      });
      const users = await this.app.auth().listUsers(max, nextPageToken);
      logger.debug(`${FILE}::USERS_FETCHED`, { users });
      return users.users;
    } catch (err) {
      throw new LesgoException(
        'Failed to fetch all users from firebase',
        'FIREBASE_FETCH_USERS',
        500,
        { err, max, maxResults, nextPageToken }
      );
    }
  }

  async createUser(data) {
    try {
      const { uid, email, password, username } = data;
      const userData = {
        uid,
        email,
        password,
        displayName: username,
      };

      logger.debug(`${FILE}::CREATING_USER`, { userData, data });
      const user = await this.app.auth().createUser(userData);
      logger.debug(`${FILE}::USER_CREATED`, { user });
      return user;
    } catch (err) {
      throw new LesgoException(
        'Failed to create user on firebase',
        'FIREBASE_CREATE_USER',
        400,
        { err, data }
      );
    }
  }

  async deleteUser(uid) {
    try {
      logger.debug(`${FILE}::DELETING_USER`);
      const deleted = await this.app.auth().deleteUser(uid);
      logger.debug(`${FILE}::USER_DELETED`, { deleted, uid });
      return deleted;
    } catch (err) {
      throw new LesgoException(
        'Failed to delete user from firebase',
        'FIREBASE_DELETE_USER',
        400,
        { err, uid }
      );
    }
  }

  async delete() {
    try {
      logger.debug(`${FILE}::DELETING_APP`);
      const resp = await this.app.delete();
      logger.debug(`${FILE}::APP_DELETED`, { resp });
      return resp;
    } catch (err) {
      throw new LesgoException(
        'Failed to delete firebase app',
        'FIREBASE_DELETE_APP',
        500,
        { err }
      );
    }
  }
}
