import { JwtPayload } from 'jsonwebtoken';
import verify from '../verify';
import sign from '../sign';

describe('sign', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the signed token', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = 'custom-secret';
    const opts = { expiresIn: '2h' };

    const result = sign(payload, secret, opts);
    const verifyResult = verify(result, secret) as JwtPayload;

    expect(verifyResult.id).toEqual(payload.id);
    expect(verifyResult.username).toEqual(payload.username);
    expect(verifyResult.exp).toBeTruthy();
    expect(verifyResult.iat).toBeTruthy();
  });

  it('should return the signed token with default opts', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = 'custom-secret';

    const result = sign(payload, secret);
    const verifyResult = verify(result, secret) as JwtPayload;

    expect(verifyResult.id).toEqual(payload.id);
    expect(verifyResult.username).toEqual(payload.username);
    expect(verifyResult.exp).toBeTruthy();
    expect(verifyResult.iat).toBeTruthy();
  });
});
