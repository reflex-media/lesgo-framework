export default {
  projectName: 'someProjectName',
  serviceAccount: {
    testing: JSON.stringify({
      type: 'service_account',
      project_id: 'fakeProjectId',
      private_key_id: 'fakePrivateKeyId',
      private_key: 'fakePrivateKey',
      client_email: 'fakeClientEmail',
      client_id: 'fakeClientId',
      auth_uri: 'https://fakeAuthUri.com',
      token_uri: 'https://fakeTokenUri.com',
      auth_provider_x509_cert_url: 'https://fakeAuthProviderCertUrl.com',
      client_x509_cert_url: 'https://fakeCertUrlcom',
    }),
  },
};
