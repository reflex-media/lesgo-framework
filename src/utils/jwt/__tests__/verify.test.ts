import jwt from '../../jwt';
import verify from '../verify';
import verifyService from '../../../services/JWTService/verify';
import jwtConfig from '../../../config/jwt';
import { LesgoException } from '../../../exceptions';

jest.mock('../../../services/JWTService/verify');

describe('verify', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call verifyService with default secret', () => {
    const token = 'some-token';
    const opts = {
      secret: '',
    };

    verify(token, opts);

    expect(verifyService).toHaveBeenCalledWith(
      token,
      jwtConfig.secrets[0].secret,
      {
        algorithm: 'HS256',
        audience: 'lesgo',
        issuer: 'lesgo',
      }
    );
  });

  it('should call verifyService with default secret when none provided', () => {
    const token = 'some-token';

    verify(token);

    expect(verifyService).toHaveBeenCalledWith(
      token,
      jwtConfig.secrets[0].secret,
      {
        algorithm: 'HS256',
        audience: 'lesgo',
        issuer: 'lesgo',
      }
    );
  });

  it('should call verifyService with provided secret', () => {
    const token = 'some-token';
    const secret = 'custom-secret';
    const opts = {
      secret,
    };

    jwt.verify(token, opts);

    expect(verifyService).toHaveBeenCalledWith(token, secret, {
      algorithm: 'HS256',
      audience: 'lesgo',
      issuer: 'lesgo',
    });
  });

  it('should call verifyService with provided kid', () => {
    const token = 'some-token';
    const opts = { opts: { keyid: jwtConfig.secrets[1].keyid } };

    jwt.verify(token, opts);

    expect(verifyService).toHaveBeenCalledWith(
      token,
      jwtConfig.secrets[1].secret,
      {
        algorithm: 'HS256',
        audience: 'lesgo',
        issuer: 'lesgo',
      }
    );
  });

  it('should throw error with invalid kid', () => {
    const token = 'some-token';
    const opts = { opts: { keyid: 'xyz' } };

    expect(() => jwt.verify(token, opts)).toThrow(
      new LesgoException(
        'lesgo.utils.jwt.verify::KID_NOT_FOUND',
        'kid xyz not found.'
      )
    );
  });

  it('should return the decoded token', () => {
    const token = 'some-token';
    const opts = {
      secret: '',
      opts: {},
    };
    const decodedToken = { id: '123', username: 'john.doe' };

    (verifyService as jest.Mock).mockReturnValue(decodedToken);

    const result = verify(token, opts);

    expect(result).toEqual(decodedToken);
  });
});
