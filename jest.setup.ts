/* eslint no-console: 0 */

// Mock the console logs
// console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Supply the process.env values
process.env = {
  ...process.env,
  APP_NAME: 'lesgo',
  APP_ENV: 'testing',
  APP_DEBUG: 'false',

  AWS_APP_REGION: 'ap-southeast-1',
  AWS_ACCOUNT_ID: '1234567890',

  LESGO_CRYPTO_HASH_ALG: 'sha256',
  LESGO_CRYPTO_ENCRYPTION_ALG: 'aes-256-cbc',
  LESGO_CRYPTO_ENCRYPTION_SEC: '90a4f4097215247b0f6a9917022dcc0a',

  LESGO_JWT_SECRET_KEYS:
    '4e5f6a7b8c9d0e1f:c4156b94c80b7f163feabd4ff268c99e,8c9d6a0e1f4e5f7b:b11ce8995df370a4fd872afb4377b273',
  LESGO_JWT_ALGORITHM: 'HS256',
  LESGO_JWT_EXPIRESIN: '1h',
  LESGO_JWT_ISSUER: 'lesgo',
  LESGO_JWT_AUDIENCE: 'lesgo',
  LESGO_JWT_VALIDATE_CLAIMS: 'true',

  LESGO_BASIC_AUTH_LIST: 'john:j04nD0e,jane:j4n3d03',

  LESGO_AWS_S3_REGION: 'ap-southeast-1',
  LESGO_AWS_S3_BUCKET: 'lesgo-dev',

  LESGO_AWS_SQS_REGION: 'ap-southeast-1',
  LESGO_AWS_SQS_QUEUE_ALIASES: 'testQueue,testQueue2',

  LESGO_AWS_DYNAMODB_REGION: 'ap-southeast-1',
  LESGO_AWS_DYNAMODB_TABLE_ALIASES: 'testingTable,testingTable2',

  LESGO_AWS_ELASTICACHE_REDIS_ENDPOINT: 'localhost',
  LESGO_AWS_ELASTICACHE_REDIS_PORT: '6379',
};