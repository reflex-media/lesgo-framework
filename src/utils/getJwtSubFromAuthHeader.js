import isEmpty from './isEmpty';

export const getTokenData = authHeader => {
  try {
    return JSON.parse(Buffer.from(authHeader.split('.')[1], 'base64'));
  } catch (err) {
    return {};
  }
};

export default authHeader => {
  if (isEmpty(authHeader)) {
    return null;
  }

  const data = getTokenData(authHeader);
  return data.sub || null;
};
