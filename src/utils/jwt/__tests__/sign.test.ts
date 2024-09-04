import sign from '../sign';
import signService from '../../../services/JWTService/sign';
import jwtConfig from '../../../config/jwt';

jest.mock('../../../services/JWTService/sign');

describe('sign', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signService with default secret and options', () => {
    const payload = { id: '123', username: 'john.doe' };

    sign(payload);

    expect(signService).toHaveBeenCalledWith(payload, undefined, undefined);
  });

  it('should call signService with provided secret and options', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = 'custom-secret';
    const opts = { expiresIn: '2h' };

    sign(payload, secret, opts);

    expect(signService).toHaveBeenCalledWith(payload, secret, {
      expiresIn: '2h',
    });
  });

  it('should call signService with provided kid', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = { keyid: jwtConfig.secrets[1].keyid };

    sign(payload, undefined, opts);

    expect(signService).toHaveBeenCalledWith(payload, undefined, {
      keyid: jwtConfig.secrets[1].keyid,
    });
  });

  it('should return the signed token', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = '';
    const signedToken = 'some-signed-token';

    (signService as jest.Mock).mockReturnValue(signedToken);

    const result = sign(payload, secret);

    expect(result).toEqual(signedToken);
  });
});
