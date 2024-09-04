import getJwtSecret, { GetJwtSecretInput, JwtSecret } from '../getJwtSecret';
import jwtConfig from '../../../config/jwt';
import { LesgoException } from '../../../exceptions';

describe('getJwtSecret', () => {
  it('should return the default jwt secret when no input is provided', () => {
    const expectedSecret: JwtSecret = {
      keyid: jwtConfig.secrets[0]?.keyid || '',
      secret: jwtConfig.secrets[0]?.secret || '',
    };

    const result = getJwtSecret({});

    expect(result).toEqual(expectedSecret);
  });

  it('should return the matching jwt secret when secret is provided', () => {
    const input: GetJwtSecretInput = {
      secret: 'b11ce8995df370a4fd872afb4377b273',
    };

    const expectedSecret: JwtSecret = {
      keyid: jwtConfig.secrets[1]?.keyid || '',
      secret: jwtConfig.secrets[1]?.secret || '',
    };

    const result = getJwtSecret(input);

    expect(result).toEqual(expectedSecret);
  });

  it('should throw an exception when no matching jwt secret is found', () => {
    const input: GetJwtSecretInput = {
      secret: 'invalidSecret',
    };

    expect(() => {
      getJwtSecret(input);
    }).toThrow(
      new LesgoException(
        'No matching JWT Secret found.',
        'lesgo.services.JWTService.getJwtSecret::SECRET_NOT_FOUND'
      )
    );
  });

  it('should return the matching jwt secret when keyid is provided', () => {
    const input: GetJwtSecretInput = {
      keyid: '4e5f6a7b8c9d0e1f',
    };

    const expectedSecret: JwtSecret = {
      keyid: jwtConfig.secrets[0]?.keyid || '',
      secret: jwtConfig.secrets[0]?.secret || '',
    };

    const result = getJwtSecret(input);

    expect(result).toEqual(expectedSecret);
  });

  it('should throw an exception when no matching keyid is found', () => {
    const input: GetJwtSecretInput = {
      keyid: 'invalidKeyid',
    };

    expect(() => {
      getJwtSecret(input);
    }).toThrow(
      new LesgoException(
        'kid invalidKeyid not found.',
        'lesgo.services.JWTService.getJwtSecret::KID_NOT_FOUND'
      )
    );
  });
});
