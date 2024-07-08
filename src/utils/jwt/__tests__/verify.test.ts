import jwt from '../../jwt';
import verify from '../verify';
import verifyService from '../../../services/JWTService/verify';

jest.mock('../../../services/JWTService/verify');

describe('verify', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call verifyService with default secret', () => {
    const token = 'some-token';
    const secret = '';
    const opts = {};

    verify(token, secret, opts);

    expect(verifyService).toHaveBeenCalledWith(
      token,
      'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
      opts
    );
  });

  it('should call verifyService with default secret when none provided', () => {
    const token = 'some-token';

    verify(token);

    expect(verifyService).toHaveBeenCalledWith(
      token,
      'c4156b94c80b7f163feabd4ff268c99eb11ce8995df370a4fd872afb4377b273',
      {}
    );
  });

  it('should call verifyService with provided secret', () => {
    const token = 'some-token';
    const secret = 'custom-secret';
    const opts = {};

    jwt.verify(token, secret, opts);

    expect(verifyService).toHaveBeenCalledWith(token, secret, opts);
  });

  it('should return the decoded token', () => {
    const token = 'some-token';
    const secret = '';
    const opts = {};
    const decodedToken = { id: '123', username: 'john.doe' };

    (verifyService as jest.Mock).mockReturnValue(decodedToken);

    const result = verify(token, secret, opts);

    expect(result).toEqual(decodedToken);
  });
});
