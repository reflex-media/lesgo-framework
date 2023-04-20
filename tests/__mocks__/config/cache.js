export default {
  default: 'memcache',
  adapters: {
    memcache: {
      options: {
        hosts: [null],
        autodiscover: true,
      },
    },
  },
};
