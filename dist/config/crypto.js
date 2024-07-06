export default {
  hash: {
    algorithm: process.env.LESGO_CRYPTO_HASH_ALG || 'sha256',
  },
  encryption: {
    algorithm: process.env.LESGO_CRYPTO_ENCRYPTION_ALG || 'aes-256-cbc',
    secretKey:
      process.env.LESGO_CRYPTO_ENCRYPTION_SEC ||
      '90a4f4097215247b0f6a9917022dcc0a',
    ivLength: parseInt(process.env.LESGO_CRYPTO_ENCRYPTION_IVLEN || '16', 10),
  },
};
