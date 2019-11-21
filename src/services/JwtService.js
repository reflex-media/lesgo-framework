import jwtpkg from 'jsonwebtoken';
import LesgoException from '../exceptions/LesgoException';

export default class JwtService {
  constructor(token, config) {
    this.decoded = jwtpkg.verify(token, config.secret);
    this.settings = {
      validate: {
        iss: config.iss.validate,
        customClaims: config.customClaims.validate,
      },
      config: {
        iss: config.iss.data,
        customClaims: config.customClaims.data,
      },
    };
  }

  validate() {
    if (
      this.settings.validate.iss &&
      this.settings.config.iss.indexOf(this.decoded.iss) === -1
    ) {
      throw new LesgoException(
        `Token's [iss] is not valid!`,
        'JWT_ISS_NOT_VALID',
        403
      );
    }

    /**
     * Your conditions here, if you would like to validate
     * custom claims: https://auth0.com/docs/tokens/jwt-claims
     */
    this.settings.config.customClaims.forEach(customClaim => {
      if (this.settings.validate.customClaims && !this.decoded[customClaim]) {
        throw new LesgoException(
          `Token's custom claim [${customClaim}] not found!`,
          'JWT_CUSTOM_CLAIM_NOT_FOUND',
          403
        );
      }
    });

    return this;
  }

  static jwt() {
    return jwtpkg;
  }
}
