import { customAlphabet } from 'nanoid';

export default async (params = {}) => {
  const { prefix, suffix, length } = params;

  const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    !length ? 21 : length
  );
  const uid = await nanoid();
  return `${!prefix ? '' : `${prefix}-`}${uid}${!suffix ? '' : `-${suffix}`}`;
};
