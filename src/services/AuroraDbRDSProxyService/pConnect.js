import connect from './connect';

const pConnect = async (connectionOpts = {}) => {
  return connect({ ...connectionOpts, persists: true });
};

export default pConnect;
