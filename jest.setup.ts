/* eslint no-console: 0 */

// Mock the console logs
console.log = jest.fn();
console.debug = jest.fn();
console.info = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Supply the process.env values
process.env = {
  ...process.env,
  LESGO_CRYPTO_HASH_ALG: 'sha256',
  LESGO_CRYPTO_ENCRYPTION_ALG: 'aes-256-cbc',
  LESGO_CRYPTO_ENCRYPTION_SEC: '90a4f4097215247b0f6a9917022dcc0a',
  LESGO_CRYPTO_ENCRYPTION_IVLEN: '16',
};
