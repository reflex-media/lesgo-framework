import { JwtPayload } from 'jsonwebtoken';
import jwtConfig from '../../../config/jwt';
import verify from '../verify';
import sign from '../sign';

describe('sign', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
});
