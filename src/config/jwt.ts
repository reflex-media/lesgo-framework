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
  expiresIn: process.env.LESGO_JWT_EXPIRESIN || '1h',
  issuer: process.env.LESGO_JWT_ISSUER || 'lesgo',
  audience: process.env.LESGO_JWT_AUDIENCE || 'lesgo',
  validateClaims: process.env.LESGO_JWT_VALIDATE_CLAIMS !== 'false',
};
