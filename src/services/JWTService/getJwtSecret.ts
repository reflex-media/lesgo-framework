import { LesgoException } from '../../exceptions';
import jwtConfig from '../../config/jwt';

const FILE = 'lesgo.services.JWTService.getJwtSecret';

export interface GetJwtSecretInput {
  secret?: string;
  keyid?: string;
}

export interface JwtSecret {
  keyid: string;
  secret: string;
}

const getJwtSecret = (input: GetJwtSecretInput) => {
  const jwtSecret = {
    keyid: input.keyid || '',
    secret: input.secret || '',
  };

  if (!input.secret) {
    jwtSecret.keyid = jwtConfig.secrets[0]?.keyid || '';
    jwtSecret.secret = jwtConfig.secrets[0]?.secret || '';
  }

  if (input.secret) {
    const foundSecret = jwtConfig.secrets.find(s => s?.secret === input.secret);

    if (!foundSecret) {
      throw new LesgoException(
        `No matching JWT Secret found.`,
        `${FILE}::SECRET_NOT_FOUND`
      );
    }

    jwtSecret.keyid = foundSecret.keyid;
    jwtSecret.secret = foundSecret.secret;
  }

  if (input.keyid) {
    const foundSecret = jwtConfig.secrets.find(s => s?.keyid === input.keyid);

    if (!foundSecret) {
      throw new LesgoException(
        `kid ${input.keyid} not found.`,
        `${FILE}::KID_NOT_FOUND`
      );
    }

    jwtSecret.keyid = foundSecret.keyid;
    jwtSecret.secret = foundSecret.secret;
  }

  if (!jwtSecret.secret) {
    throw new LesgoException(
      'Missing Secret to sign JWT',
      `${FILE}::SECRET_NOT_FOUND`
    );
  }

  return jwtSecret;
};

export default getJwtSecret;
