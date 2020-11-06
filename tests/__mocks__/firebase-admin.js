export const initializeApp = jest.fn().mockImplementation(() => {
  return {
    auth: jest.fn().mockImplementation(() => {
      return {
        listUsers: jest.fn().mockImplementation((maxLength, nextPageToken) => {
          if (nextPageToken && typeof nextPageToken !== 'string') {
            return Promise.reject(
              new Error(
                'The page token must be a valid non-empty string.',
                'auth/invalid-page-token'
              )
            );
          }

          if (!Number.isInteger(maxLength)) {
            return Promise.reject(
              new Error(
                'The page token must be a valid non-empty string.',
                'auth/invalid-page-token'
              )
            );
          }

          return Promise.resolve({
            users: [
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
            ],
            mocked: {
              maxLength,
              nextPageToken,
            },
          });
        }),
        createUser: jest.fn().mockImplementation(data => {
          const { uid, email, displayName } = data;

          if (email === 'existingEmail@mail.com') {
            return Promise.reject(
              new Error(
                'The email address is already in use by another account.',
                'auth/email-already-exists'
              )
            );
          }

          return Promise.resolve({
            uid,
            email,
            emailVerified: false,
            displayName,
          });
        }),
        deleteUser: jest.fn().mockImplementation(uid => {
          if (uid === 'non-existing-uid') {
            return Promise.reject(
              new Error(
                'FAKE-The user does not exist.',
                'FAKE-auth/user-does-not-exist'
              )
            );
          }

          return Promise.resolve({ uid });
        }),
      };
    }),
    delete: jest.fn().mockImplementation(fakeError => {
      if (fakeError)
        throw new Error('FAKE-failed-delete-app', 'FAKE-App failed to delete');

      return jest.fn();
    }),
  };
});

export const credential = {
  cert: jest.fn().mockImplementation(serviceAccount => {
    return {
      mocked: {
        serviceAccount,
      },
    };
  }),
};

export default {
  initializeApp,
  credential,
};
