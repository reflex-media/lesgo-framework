export default jest.fn(() => ({
  before: jest.fn().mockResolvedValue(undefined),
  after: undefined,
  onError: undefined,
}));
