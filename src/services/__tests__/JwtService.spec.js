import config from 'config/jwt'; // eslint-disable-line import/no-unresolved
import jwt from 'jsonwebtoken';
import JwtService from '../JwtService';
import { token } from '../../middlewares/verifyJwtMiddleware';

describe('ServicesGroup: test JwtService instantiation', () => {
  it('test instantiate default JwtService', () => {
    const headers = {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJpc3MiOiJkb21haW4uY29tIiwiZGVwYXJ0bWVudF9pZCI6MX0.pa2TBRqdVSFUhmiglB8SD8ImthqhqZBn0stAdNRcJ3w',
    };

    const service = new JwtService(token(headers), config);

    expect(service).toMatchObject({
      decoded: {
        sub: '1234567890',
        name: 'John Doe',
        iss: config.iss.data[0],
      },
      settings: {
        validate: {
          iss: config.iss.validate,
          customClaims: config.customClaims.validate,
        },
        config: {
          iss: config.iss.data,
          customClaims: config.customClaims.data,
        },
      },
    });

    expect(service.jwt()).toMatchObject(jwt);
  });
});
