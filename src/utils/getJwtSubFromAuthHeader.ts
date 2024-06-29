import isEmpty from './isEmpty';

export const getTokenData = (authHeader: string) => {
  try {
    return JSON.parse(
      Buffer.from(authHeader.split('.')[1], 'base64').toString()
    );
  } catch (err) {
    return {};
  }
};

const getJwtSubFromAuthHeader = (authHeader: string) => {
  if (isEmpty(authHeader)) {
    return null;
  }

  const data = getTokenData(authHeader);
  return data.sub || null;
};

export default getJwtSubFromAuthHeader;
