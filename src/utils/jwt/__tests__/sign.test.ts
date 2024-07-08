import jwt from '../../jwt';
import sign from '../sign';
import signService from '../../../services/JWTService/sign';

jest.mock('../../../services/JWTService/sign');

describe('sign', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signService with default secret and options', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = '';
    const opts = {};

    sign(payload, secret, opts);

    expect(signService).toHaveBeenCalledWith(
      payload,
      'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
      {
        expiresIn: '1h',
      }
    );
  });

  it('should call signService with default secret and options when non provided', () => {
    const payload = { id: '123', username: 'john.doe' };

    sign(payload);

    expect(signService).toHaveBeenCalledWith(
      payload,
      'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
      {
        expiresIn: '1h',
      }
    );
  });

  it('should call signService with provided secret and options', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = 'custom-secret';
    const opts = { expiresIn: '2h' };

    jwt.sign(payload, secret, opts);

    expect(signService).toHaveBeenCalledWith(payload, secret, opts);
  });

  it('should return the signed token', () => {
    const payload = { id: '123', username: 'john.doe' };
    const secret = '';
    const opts = {};
    const signedToken = 'some-signed-token';

    (signService as jest.Mock).mockReturnValue(signedToken);

    const result = sign(payload, secret, opts);

    expect(result).toEqual(signedToken);
  });
});
