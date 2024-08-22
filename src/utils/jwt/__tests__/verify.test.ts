import { sign } from '../../jwt';
import verify from '../verify';
import verifyService from '../../../services/JWTService/verify';
import jwtConfig from '../../../config/jwt';

jest.mock('../../../services/JWTService/verify');

describe('verify', () => {
  const token = sign({ id: '123', username: 'john.doe' });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call verifyService with default secret when none provided', () => {
    verify(token);

    expect(verifyService).toHaveBeenCalledWith(token, undefined, undefined);
  });

  it('should call verifyService with Bearer Token', () => {
    verify(`Bearer ${token}`);

    expect(verifyService).toHaveBeenCalledWith(token, undefined, undefined);
  });

  it('should call verifyService with provided secret', () => {
    const secret = 'custom-secret';

    verify(token, secret);

    expect(verifyService).toHaveBeenCalledWith(token, secret, undefined);
  });

  it('should call verifyService with provided kid', () => {
    const opts = { keyid: jwtConfig.secrets[1].keyid };

    verify(token, undefined, opts);

    expect(verifyService).toHaveBeenCalledWith(token, undefined, opts);
  });

  it('should return the decoded token', () => {
    const secret = '';
    const opts = {};
    const decodedToken = { id: '123', username: 'john.doe' };

    (verifyService as jest.Mock).mockReturnValue(decodedToken);

    const result = verify(token, secret, opts);

    expect(result).toEqual(decodedToken);
  });
});
