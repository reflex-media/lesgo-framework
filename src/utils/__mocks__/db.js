export const mockData = {
  index_0: 'data_0',
  index_1: 'data_1',
  index_2: 'data_2',
};

export default {
  // eslint-disable-next-line no-unused-vars
  select: jest.fn().mockImplementation((sql, sqlParams) => {
    return Promise.resolve({
      ...mockData,
    });
  }),
};
