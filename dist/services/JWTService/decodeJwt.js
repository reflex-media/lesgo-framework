const decodeJwt = token => {
  const parts = token.split('.');
  return {
    header: JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')),
    signature: parts[2],
  };
};
export default decodeJwt;
