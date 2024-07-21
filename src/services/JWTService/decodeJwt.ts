import { JwtHeader, JwtPayload } from 'jsonwebtoken';

const decodeJwt = (token: string) => {
  const parts = token.split('.');

  return {
    header: JSON.parse(
      Buffer.from(parts[0], 'base64').toString('utf8')
    ) as JwtHeader,
    payload: JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf8')
    ) as JwtPayload,
    signature: parts[2],
  };
};

export default decodeJwt;
