export default {
  default: 'aws',
  adapters: {
    aws: {
      connection: 'aws',
      index: 'lesgo',
      type: '_doc',
      options: {
        node: [
          {
            url: null,
            maxRetries: 1,
            awsRegion: 'us-west-1',
          },
        ],
      },
    },
  },
};
