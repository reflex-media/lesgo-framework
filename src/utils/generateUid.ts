import { customAlphabet } from 'nanoid';

export interface GenerateUidParams {
  prefix?: string;
  suffix?: string;
  length?: number;
}

const generateUid = (params: GenerateUidParams = {}) => {
  const { prefix, suffix, length } = params;

  const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    !length ? 21 : length
  );
  const uid = nanoid();
  return `${!prefix ? '' : `${prefix}-`}${uid}${!suffix ? '' : `-${suffix}`}`;
};

export default generateUid;
