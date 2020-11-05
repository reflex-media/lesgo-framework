import * as firebaseAdmin from 'firebase-admin';
import logger from '../utils/logger';
import LesgoException from '../exceptions/LesgoException';

export default class FirebaseAdmin {
  constructor(opts = {}) {
    this.app = null;
    this.connect(opts);
  }

  connect(opts) {
    const { serviceAccount, databaseURL } = opts;

    this.app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL,
    });
  }

  async getAllUsers(nextPageToken) {
    try {
      logger.info('FETCHING FIREBASE USERS', { nextPageToken });
      const users = await this.app.auth().listUsers(25, nextPageToken);
      logger.info('FETCHED FIREBASE USERS', { users });
      return users;
    } catch (err) {
      throw new LesgoException(
        'Failed to getch all users from firebase',
        'FIREBASE_FETCH_USERS',
        500,
        { err, nextPageToken }
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
