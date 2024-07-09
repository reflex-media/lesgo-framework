const secretKeys =
  process.env.LESGO_JWT_SECRET_KEYS ||
  '4e5f6a7b8c9d0e1f:c4156b94c80b7f163feabd4ff268c99e,8c9d6a0e1f4e5f7b:b11ce8995df370a4fd872afb4377b273';
const secrets = secretKeys.split(',').map(key => {
  if (!key.includes(':')) {
    return { keyid: '1', secret: key };
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
