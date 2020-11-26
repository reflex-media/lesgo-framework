export default {
  region: 'ap-southeast-1',
  sqs: {
    queues: {
      pingQueue: {
        url: jest.fn(),
      },
    },
  },
  s3: jest.fn(),
};
