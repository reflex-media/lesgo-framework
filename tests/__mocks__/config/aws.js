export default {
  sqs: {
    queues: {
      pingQueue: {
        url: jest.fn(),
      },
    },
  },
  s3: jest.fn(),
  sentry: {
    enabled: true,
  },
};
