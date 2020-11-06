import * as firebaseAdmin from 'firebase-admin';
import firebaseConfig from 'Config/firebase'; // eslint-disable-line import/no-unresolved
import FirebaseAdminService from '../FirebaseAdminService';
import LesgoException from '../../exceptions/LesgoException';

describe('test FirebaseAdminService connect', () => {
  it('should not throw an error when instantiating FirebaseAdminService', () => {
    // eslint-disable-next-line no-unused-vars
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    expect(firebaseAdmin.initializeApp).toHaveBeenCalledWith({
      credential: firebaseAdmin.credential.cert(firebaseConfig.serviceAccount),
      databaseURL: `https://${firebaseConfig.projectName}.firebaseio.com`,
    });

    expect(firebaseAdmin.credential.cert).toHaveBeenCalledWith(
      firebaseConfig.serviceAccount
    );
  });

  it('should have the new configuration when updating connection credentials', () => {
    const firebaseAdminConfig = {
      serviceAccount: JSON.stringify({ someCredKey: 'someCredValue' }),
      projectName: 'fakeProjectName',
    };

    const fbAdmin = new FirebaseAdminService(firebaseConfig);
    fbAdmin.connect(firebaseAdminConfig);

    expect(firebaseAdmin.initializeApp).toHaveBeenCalledWith({
      credential: firebaseAdmin.credential.cert(
        firebaseAdminConfig.serviceAccount
      ),
      databaseURL: `https://${firebaseAdminConfig.projectName}.firebaseio.com`,
    });
  });

  it('should throw an error when instantiating FirebaseAdminService with missing serviceAccount', () => {
    try {
      expect(
        new FirebaseAdminService({
          projectName: firebaseConfig.projectName,
        })
      ).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          'Missing required parameters serviceAccount and or projectName',
          'FIREBASEADMIN_MISSING_PARAMETERS',
          500
        )
      );
    }
  });

  it('should throw an error when instantiating FirebaseAdminService with missing projectName', () => {
    try {
      expect(
        new FirebaseAdminService({
          serviceAccount: JSON.stringify({ someCredKey: 'someCredValue' }),
        })
      ).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          'Missing required parameters serviceAccount and or projectName',
          'FIREBASEADMIN_MISSING_PARAMETERS',
          500
        )
      );
    }
  });
});

describe('test FirebaseAdminService getAllUsers', () => {
  it('should return list of users with default', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    const firebaseUsers = await fbAdmin.getAllUsers();

    expect(firebaseUsers).toMatchObject([
      {
        uid: 'some-uid-001',
        email: 'some+email001@mail.com',
        emailVerified: false,
        displayName: 'SomeUser001',
      },
      {
        uid: 'some-uid-002',
        email: 'some+email002@mail.com',
        emailVerified: false,
        displayName: 'SomeUser002',
      },
      {
        uid: 'some-uid-003',
        email: 'some+email003@mail.com',
        emailVerified: false,
        displayName: 'SomeUser003',
      },
    ]);
  });

  it('should return list of users with maxResults', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    const firebaseUsers = await fbAdmin.getAllUsers(25);

    expect(firebaseUsers).toMatchObject([
      {
        uid: 'some-uid-001',
        email: 'some+email001@mail.com',
        emailVerified: false,
        displayName: 'SomeUser001',
      },
      {
        uid: 'some-uid-002',
        email: 'some+email002@mail.com',
        emailVerified: false,
        displayName: 'SomeUser002',
      },
      {
        uid: 'some-uid-003',
        email: 'some+email003@mail.com',
        emailVerified: false,
        displayName: 'SomeUser003',
      },
    ]);
  });

  it('should return list of users when calling calling the function with valid nextPageToken', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    const firebaseUsers = await fbAdmin.getAllUsers(
      25,
      'SAMPLE_NEXTPAGE_TOKEN'
    );

    expect(firebaseUsers).toMatchObject([
      {
        uid: 'some-uid-001',
        email: 'some+email001@mail.com',
        emailVerified: false,
        displayName: 'SomeUser001',
      },
      {
        uid: 'some-uid-002',
        email: 'some+email002@mail.com',
        emailVerified: false,
        displayName: 'SomeUser002',
      },
      {
        uid: 'some-uid-003',
        email: 'some+email003@mail.com',
        emailVerified: false,
        displayName: 'SomeUser003',
      },
    ]);
  });

  it('should throw an exception with invalid maxResults', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    try {
      await fbAdmin.getAllUsers('asd');
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          'Failed to fetch all users from firebase',
          'FIREBASE_FETCH_USERS',
          500,
          {
            err: {
              code: 'auth/argument-error',
              message:
                'Required "maxResults" must be a positive integer that does not exceed 1000.',
            },
          }
        )
      );
    }
  });

  it('should throw an exception with invalid nextPageToken', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    try {
      await fbAdmin.getAllUsers(25, {
        token: 'invalidToken',
      });
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          'Failed to fetch all users from firebase',
          'FIREBASE_FETCH_USERS',
          500,
          {
            err: {
              code: 'auth/invalid-page-token',
              message: 'The page token must be a valid non-empty string.',
            },
          }
        )
      );
    }
  });
});

describe('test FirebaseAdminService createUser', () => {
  it('should return success response when calling the function', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    const firebaseUser = await fbAdmin.createUser({
      uid: 'some-uid',
      email: 'someemail@mail.com',
      password: 'somePassword',
      username: 'someUsername',
    });

    expect(firebaseUser).toMatchObject({
      uid: 'some-uid',
      email: 'someemail@mail.com',
      emailVerified: false,
      displayName: 'someUsername',
    });
  });

  it('should throw an exception with existing email', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    try {
      await fbAdmin.createUser({
        uid: 'some-uid',
        email: 'existingEmail@mail.com',
        password: 'somePassword',
        username: 'someUsername',
      });
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          'Failed to create user on firebase',
          'FIREBASE_CREATE_USER',
          400,
          {
            err: {
              code: 'auth/email-already-exists',
              message:
                'The email address is already in use by another account.',
            },
          }
        )
      );
    }
  });
});

describe('test FirebaseAdminService deleteUser', () => {
  it('should return success response when calling the function', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    const firebaseUser = await fbAdmin.deleteUser('some-uid');
    expect(firebaseUser).toMatchObject({ uid: 'some-uid' });
  });

  it('should throw an exception with non-existing uid', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    try {
      await fbAdmin.deleteUser('non-existing-uid');
    } catch (err) {
      expect(err.name).toBe('LesgoException');
      expect(err.message).toBe('Failed to delete user from firebase');
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe('FIREBASE_DELETE_USER');
      expect(err.extra.err).toMatchObject(
        new Error(
          'FAKE-The user does not exist.',
          'FAKE-auth/user-does-not-exist'
        )
      );
    }
  });
});

describe('test FirebaseAdminService delete', () => {
  it('should return success response when calling the function', () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    expect(fbAdmin.delete()).toBeDefined();
  });
});
