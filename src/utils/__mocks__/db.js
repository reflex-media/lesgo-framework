export const mockData = {
  index_0: 'data_0',
  index_1: 'data_1',
  index_2: 'data_2',
  index_3: 'data_3',
  index_4: 'data_4',
};

export const mockDataFirstItem = {
  index_0: 'data_0_first_item',
  index_1: 'data_1_first_item',
  index_2: 'data_2_first_item',
  index_3: 'data_3_first_item',
  index_4: 'data_4_first_item',
};

export const mockDataLastItem = {
  index_0: 'data_0_last_item',
  index_1: 'data_1_last_item',
  index_2: 'data_2_last_item',
  index_3: 'data_3_last_item',
  index_4: 'data_4_last_item',
};

export default {
  // eslint-disable-next-line no-unused-vars
  select: jest.fn().mockImplementation((sql, sqlParams) => {
    if (sql.startsWith('SELECT * FROM tests LIMIT 6 OFFSET 10')) {
      return Promise.resolve([
        { ...mockDataFirstItem },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockDataLastItem },
      ]);
    }

    if (sql.startsWith('SELECT * FROM tests LIMIT 6')) {
      return Promise.resolve([
        { ...mockDataFirstItem },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockDataLastItem },
        { ...mockData },
      ]);
    }

    if (sql.startsWith('SELECT * FROM total_tests')) {
      return Promise.resolve([
        { ...mockDataFirstItem },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockDataLastItem },
      ]);
    }

    if (sql.startsWith('SELECT * FROM tests')) {
      return Promise.resolve([
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockData },
      ]);
    }

    return Promise.resolve({
      mocked: {
        sql,
        sqlParams,
      },
    });
  }),
};
