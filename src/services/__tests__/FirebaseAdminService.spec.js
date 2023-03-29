import * as firebaseAdmin from 'firebase-admin';
import firebaseConfig from 'config/firebase'; // eslint-disable-line import/no-unresolved
import FirebaseAdminService from '../FirebaseAdminService';

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

  it('should throw an error when instantiating FirebaseAdminService without setting opts', () => {
    let err = {};
    try {
      expect(new FirebaseAdminService()).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual(
        'Missing required parameters serviceAccount and or projectName'
      );
      expect(err.code).toEqual(`FIREBASEADMIN_MISSING_PARAMETERS`);
      expect(err.statusCode).toEqual(500);
    }
  });

  it('should throw an error when instantiating FirebaseAdminService with missing serviceAccount', () => {
    let err = {};
    try {
      expect(
        new FirebaseAdminService({
          projectName: firebaseConfig.projectName,
        })
      ).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual(
        'Missing required parameters serviceAccount and or projectName'
      );
      expect(err.code).toEqual(`FIREBASEADMIN_MISSING_PARAMETERS`);
      expect(err.statusCode).toEqual(500);
    }
  });

  it('should throw an error when instantiating FirebaseAdminService with missing projectName', () => {
    let err = {};
    try {
      expect(
        new FirebaseAdminService({
          serviceAccount: JSON.stringify({ someCredKey: 'someCredValue' }),
        })
      ).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual(
        'Missing required parameters serviceAccount and or projectName'
      );
      expect(err.code).toEqual(`FIREBASEADMIN_MISSING_PARAMETERS`);
      expect(err.statusCode).toEqual(500);
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

    let err = {};
    try {
      await fbAdmin.getAllUsers('asd');
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Failed to fetch all users from firebase');
      expect(err.code).toEqual('FIREBASE_FETCH_USERS');
      expect(err.statusCode).toEqual(500);
      expect(err.extra.err).toMatchObject(
        new Error(
          'The page token must be a valid non-empty string.',
          'auth/invalid-page-token'
        )
      );
    }
  });

  it('should throw an exception with invalid nextPageToken', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    let err = {};
    try {
      await fbAdmin.getAllUsers(25, {
        token: 'invalidToken',
      });
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Failed to fetch all users from firebase');
      expect(err.code).toEqual('FIREBASE_FETCH_USERS');
      expect(err.statusCode).toEqual(500);
      expect(err.extra.err).toMatchObject(
        new Error(
          'The page token must be a valid non-empty string.',
          'auth/invalid-page-token'
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

    let err = {};
    try {
      await fbAdmin.createUser({
        uid: 'some-uid',
        email: 'existingEmail@mail.com',
        password: 'somePassword',
        username: 'someUsername',
      });
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Failed to create user on firebase');
      expect(err.code).toEqual('FIREBASE_CREATE_USER');
      expect(err.statusCode).toEqual(400);
      expect(err.extra.err).toMatchObject(
        new Error(
          'The email address is already in use by another account.',
          'auth/email-already-exists'
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

    let err = {};
    try {
      await fbAdmin.deleteUser('non-existing-uid');
    } catch (e) {
      err = { ...e };
    } finally {
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
  it('should return success response when calling the function', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: firebaseConfig.projectName,
    });

    return expect(fbAdmin.delete()).resolves.toBeDefined();
  });

  it('should be able to catch thrown exception', async () => {
    const fbAdmin = new FirebaseAdminService({
      serviceAccount: firebaseConfig.serviceAccount,
      projectName: 'fakeError',
    });

    let err = {};
    try {
      const resp = await fbAdmin.delete();
      expect(resp).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Failed to delete firebase app');
      expect(err.code).toEqual(`FIREBASE_DELETE_APP`);
      expect(err.statusCode).toEqual(500);
    }
  });
});
