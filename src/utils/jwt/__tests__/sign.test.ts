import jwt from '../../jwt';
import sign from '../sign';
import signService from '../../../services/JWTService/sign';
import jwtConfig from '../../../config/jwt';
import { LesgoException } from '../../../exceptions';

jest.mock('../../../services/JWTService/sign');

describe('sign', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signService with default secret and options', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = {
      secret: '',
    };

    sign(payload, opts);

    expect(signService).toHaveBeenCalledWith(
      payload,
      jwtConfig.secrets[0].secret,
      {
        algorithm: 'HS256',
        audience: 'lesgo',
        expiresIn: '1h',
        issuer: 'lesgo',
        jwtid: expect.any(String),
        subject: '',
      }
    );
  });

  it('should call signService with default secret and options when non provided', () => {
    const payload = { id: '123', username: 'john.doe' };

    sign(payload);

    expect(signService).toHaveBeenCalledWith(
      payload,
      jwtConfig.secrets[0].secret,
      {
        algorithm: 'HS256',
        audience: 'lesgo',
        expiresIn: '1h',
        issuer: 'lesgo',
        jwtid: expect.any(String),
        subject: '',
      }
    );
  });

  it('should call signService with provided secret and options', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = 'custom-secret';
    const opts = { secret, opts: { expiresIn: '2h' } };

    jwt.sign(payload, opts);

    expect(signService).toHaveBeenCalledWith(payload, secret, {
      algorithm: 'HS256',
      audience: 'lesgo',
      expiresIn: '2h',
      issuer: 'lesgo',
      jwtid: expect.any(String),
      subject: '',
    });
  });

  it('should call signService with provided kid', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = { opts: { keyid: jwtConfig.secrets[1].keyid } };

    jwt.sign(payload, opts);

    expect(signService).toHaveBeenCalledWith(
      payload,
      jwtConfig.secrets[1].secret,
      {
        algorithm: 'HS256',
        audience: 'lesgo',
        expiresIn: '1h',
        issuer: 'lesgo',
        jwtid: expect.any(String),
        keyid: jwtConfig.secrets[1].keyid,
        subject: '',
      }
    );
  });

  it('should throw error with invalid kid', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = { opts: { keyid: 'xyz' } };

    expect(() => jwt.sign(payload, opts)).toThrow(
      new LesgoException(
        'lesgo.utils.jwt.sign::KID_NOT_FOUND',
        'kid xyz not found.'
      )
    );
  });

  it('should return the signed token', () => {
    const payload = { id: '123', username: 'john.doe' };
    const opts = {
      secret: '',
    };
    const signedToken = 'some-signed-token';

    (signService as jest.Mock).mockReturnValue(signedToken);

    const result = sign(payload, opts);

    expect(result).toEqual(signedToken);
  });
});
