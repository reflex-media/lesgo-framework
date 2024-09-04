export default {
  hash: {
    algorithm: process.env.LESGO_CRYPTO_HASH_ALG || 'sha256',
  },
  encryption: {
    algorithm: process.env.LESGO_CRYPTO_ENCRYPTION_ALG || 'aes-256-cbc',
    secretKey: process.env.LESGO_CRYPTO_ENCRYPTION_SEC,
  },
};
