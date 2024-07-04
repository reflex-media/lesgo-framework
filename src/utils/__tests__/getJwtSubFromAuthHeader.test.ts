import getJwtSubFromAuthHeader, {
  getTokenData,
} from '../getJwtSubFromAuthHeader';

const sampleAuthHeader =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('getJwtSubFromAuthHeader', () => {
  describe('getTokenData', () => {
    it('should return an empty object if authHeader is invalid', () => {
      const authHeader = 'invalid-auth-header';
      const tokenData = getTokenData(authHeader);
      expect(tokenData).toEqual({});
    });
  });

  describe('getJwtSubFromAuthHeader', () => {
    it('should return null if authHeader is empty', () => {
      const authHeader = '';
      const jwtSub = getJwtSubFromAuthHeader(authHeader);
      expect(jwtSub).toBeNull();
    });

    it('should return null if authHeader is invalid', () => {
      const authHeader = 'invalid-auth-header';
      const jwtSub = getJwtSubFromAuthHeader(authHeader);
      expect(jwtSub).toBeNull();
    });

    it('should return the sub value from token data if authHeader is valid', () => {
      const expectedTokenData = { sub: '1234567890' };
      const jwtSub = getJwtSubFromAuthHeader(sampleAuthHeader);
      expect(jwtSub).toBe(expectedTokenData.sub);
    });
  });
});
