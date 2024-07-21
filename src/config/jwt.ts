const secretKeys = process.env.LESGO_JWT_SECRET_KEYS || '';

const secrets = secretKeys.split(',').map(key => {
  if (!key.includes(':')) {
    return { keyid: '0', secret: key };
  }

  const [keyid, secret] = key.split(':');
  return { keyid, secret };
});

export default {
  algorithm: process.env.LESGO_JWT_ALGORITHM || 'HS256',
  secrets,
  expiresIn: process.env.LESGO_JWT_EXPIRES_IN || '1h',
  issuer: process.env.LESGO_JWT_ISSUER || 'lesgo-api',
  audience: process.env.LESGO_JWT_AUDIENCE || 'lesgo-web',
  validateClaims: process.env.LESGO_JWT_VALIDATE_CLAIMS !== 'false',
};
