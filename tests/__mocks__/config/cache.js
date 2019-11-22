export default {
  default: 'memcached',
  connections: {
    memcached: {
      url: null,
      options: {
        autoDiscover: true,
        autoDiscoverInterval: 60000,
        autoDiscoverOverridesRemove: false,
      },
    },
  },
};
