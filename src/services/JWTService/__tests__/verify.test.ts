import { Jwt, JwtPayload, SignOptions } from 'jsonwebtoken';
import jwtConfig from '../../../config/jwt';
import { verify, sign } from '../../JWTService';

describe('verify', () => {
  it('should return the signed token', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = jwtConfig.secrets[0].secret;
    const opts: SignOptions = { expiresIn: '2h' };

    const result = sign(payload, secret, opts);
    const verifyResult = verify(result, secret) as JwtPayload;

    expect(verifyResult.header).toMatchObject({
      alg: 'HS256',
      typ: 'JWT',
      kid: jwtConfig.secrets[0].keyid,
    });
    expect(verifyResult.payload).toMatchObject(payload);
  });

  it('should return the signed token with default opts', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = {
      keyid: jwtConfig.secrets[1].keyid,
    };

    const result = sign(payload, undefined, opts);
    const verifyResult = verify(result) as Jwt;

    expect(verifyResult.header).toMatchObject({
      alg: 'HS256',
      typ: 'JWT',
      kid: jwtConfig.secrets[1].keyid,
    });
    expect(verifyResult.payload).toMatchObject(payload);
  });
});
