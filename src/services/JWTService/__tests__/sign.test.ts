import { JwtPayload } from 'jsonwebtoken';
import jwtConfig from '../../../config/jwt';
import { sign, verify } from '../../JWTService';
import { LesgoException } from '../../../exceptions';

describe('sign', () => {
  it('should return the signed token', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = jwtConfig.secrets[0].secret;
    const opts = { expiresIn: '2h' };

    const result = sign(payload, secret, opts);
    const verifyResult = verify(result, secret) as JwtPayload;

    expect(verifyResult.payload).toMatchObject(payload);
  });

  it('should return the signed token with default opts', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = jwtConfig.secrets[0].secret;

    const result = sign(payload, secret);
    const verifyResult = verify(result, secret) as JwtPayload;

    expect(verifyResult.payload).toMatchObject(payload);
  });

  it('should throw exception with invalid secret', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = 'undefined-secret';

    expect(() => sign(payload, secret)).toThrow(
      new LesgoException(
        'No matching JWT Secret found.',
        'lesgo.services.JWTService.getJwtSecret::SECRET_NOT_FOUND'
      )
    );
  });

  it('should throw exception with invalid keyid', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = {
      keyid: 'invalid-keyid',
    };

    expect(() => sign(payload, undefined, opts)).toThrow(
      new LesgoException(
        `kid ${opts.keyid} not found.`,
        'lesgo.services.JWTService.getJwtSecret::KID_NOT_FOUND'
      )
    );
  });
});
