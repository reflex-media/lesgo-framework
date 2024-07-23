import signService from '../../services/JWTService/sign';
const sign = (payload, secret, opts) => {
  return signService(payload, secret, opts);
};
export default sign;
