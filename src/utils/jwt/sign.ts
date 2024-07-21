import { SignOptions } from 'jsonwebtoken';
import signService from '../../services/JWTService/sign';

const sign = (payload: any, secret?: string, opts?: SignOptions) => {
  return signService(payload, secret, opts);
};

export default sign;
