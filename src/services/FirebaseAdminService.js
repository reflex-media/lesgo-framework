import * as firebaseAdmin from 'firebase-admin';
import logger from '../utils/logger';
import isEmpty from '../utils/isEmpty';
import LesgoException from '../exceptions/LesgoException';

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
      logger.info('FETCHING FIREBASE USERS', {
        max,
        maxResults,
        nextPageToken,
      });
      const users = await this.app.auth().listUsers(max, nextPageToken);
      logger.info('FETCHED FIREBASE USERS', { users });
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

      logger.info('CREATING USER ON FIREBASE', { userData, data });
      const user = await this.app.auth().createUser(userData);
      logger.info('USER CREATED ON FIREBASE', { user });
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
      logger.info('DELETING FIREBASE USER');
      const deleted = await this.app.auth().deleteUser(uid);
      logger.info('DELETED FIREBASE USER', { deleted, uid });
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
      logger.info('DELETING FIREBASE APP');
      return this.app.delete();
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
