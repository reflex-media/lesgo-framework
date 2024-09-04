const basicAuthList = process.env.LESGO_BASIC_AUTH_LIST || '';

const authorizedList = basicAuthList.split(',').map(key => {
  const [username, password] = key.split(':');
  return { username, password };
});

export default {
  authorizedList,
};
