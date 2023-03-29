import LengthAwarePaginator from '../pagination/LengthAwarePaginator';
import {
  mockData,
  mockDataFirstItem,
  mockDataLastItem,
} from '../../utils/__mocks__/db';
import db from '../../utils/db';

jest.mock('../../utils/db');

beforeEach(() => {
  db.select.mockClear();
});

const FILE = 'Services/pagination/LengthAwarePaginator';

describe('test LengthAwarePaginator instantiate', () => {
  it('should not throw exception when instantiating', async () => {
    const paginator = new LengthAwarePaginator(
      db,
      'SELECT * FROM tests',
      {},
      {
        perPage: 5,
        total: 30,
      }
    );

    expect(await paginator.count()).toEqual(5);
    expect(paginator.currentPage()).toEqual(1);
    expect(await paginator.firstItem()).toMatchObject(mockDataFirstItem);
    expect(await paginator.lastItem()).toMatchObject(mockDataLastItem);
    expect(paginator.perPage()).toEqual(5);
    expect(await paginator.total()).toEqual(30);

    expect(db.select).toHaveBeenCalled();
  });
  it('should not throw exception when instantiating with current page', async () => {
    const paginator = new LengthAwarePaginator(
      db,
      'SELECT * FROM tests',
      {},
      {
        perPage: 5,
        currentPage: 2,
        total: 30,
      }
    );

    expect(await paginator.count()).toEqual(5);
    expect(paginator.currentPage()).toEqual(2);
    expect(await paginator.firstItem()).toMatchObject(mockDataFirstItem);
    expect(await paginator.lastItem()).toMatchObject(mockDataLastItem);
    expect(paginator.perPage()).toEqual(5);
    expect(await paginator.total()).toEqual(30);

    expect(db.select).toHaveBeenCalled();
  });
  it('should default perPage to 10 when instantiating without perPage', async () => {
    const paginator = new LengthAwarePaginator(
      db,
      'SELECT * FROM tests',
      {},
      {
        total: 30,
      }
    );

    expect(await paginator.count()).toEqual(10);
    expect(paginator.currentPage()).toEqual(1);
    expect(paginator.perPage()).toEqual(10);
    expect(await paginator.total()).toEqual(30);

    expect(db.select).toHaveBeenCalled();
  });
  it('should throw exception if total is not a number', async () => {
    let err = {};
    try {
      expect(
        new LengthAwarePaginator(
          db,
          'SELECT * FROM tests',
          {},
          {
            perPage: 5,
            currentPage: 1,
            total: 'test',
          }
        )
      ).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual(
        "Invalid type for 'total', expecting 'number'"
      );
      expect(err.code).toEqual(`${FILE}::FIELD_VALIDATION_EXCEPTION`);
      expect(err.statusCode).toEqual(500);
    }
  });
  it('should return the object version of the paginator', async () => {
    const paginator = new LengthAwarePaginator(
      db,
      'SELECT * FROM total_tests',
      {},
      {
        perPage: 5,
        total: 30,
      }
    );
    expect(await paginator.toObject()).toMatchObject({
      count: 5,
      previous_page: false,
      current_page: 1,
      next_page: 2,
      per_page: 5,
      last_page: 6,
      total: 30,
      items: [
        { ...mockDataFirstItem },
        { ...mockData },
        { ...mockData },
        { ...mockData },
        { ...mockDataLastItem },
      ],
    });

    expect(db.select).toHaveBeenCalled();
  });

  it('should simply return an empty paginator object if total is explicitly zero', async () => {
    const paginator = new LengthAwarePaginator(
      db,
      'SELECT * FROM tests',
      {},
      {
        perPage: 5,
        currentPage: 1,
        total: 0,
      }
    );

    expect(await paginator.count()).toEqual(0);
    expect(await paginator.previousPage()).toEqual(false);
    expect(paginator.currentPage()).toEqual(1);
    expect(await paginator.nextPage()).toEqual(false);
    expect(await paginator.firstItem()).toBe(undefined);
    expect(await paginator.lastItem()).toBe(undefined);
    expect(paginator.perPage()).toEqual(5);
    expect(await paginator.total()).toEqual(0);

    expect(await paginator.toObject()).toMatchObject({
      count: 0,
      previous_page: false,
      current_page: 1,
      next_page: false,
      per_page: 5,
      last_page: 0,
      total: 0,
      items: [],
    });

    expect(db.select).not.toHaveBeenCalled();
  });
});

describe('test total() usage', () => {
  it('should get total number of data using supplied paramater', async () => {
    const paginator = new LengthAwarePaginator(
      db,
      'SELECT * FROM total_tests',
      {},
      {
        perPage: 10,
        currentPage: 1,
        total: 30,
      }
    );

    expect(await paginator.total()).toEqual(30);
    expect(db.select).not.toHaveBeenCalled();
  });
});

describe('test lastPage() usage', () => {
  it('should get the last page using supplied parameter as total data', async () => {
    const paginator1 = new LengthAwarePaginator(
      db,
      'SELECT * FROM total_tests',
      {},
      {
        perPage: 10,
        currentPage: 1,
        total: 30,
      }
    );
    expect(await paginator1.lastPage()).toEqual(3);

    const paginator2 = new LengthAwarePaginator(
      db,
      'SELECT * FROM total_tests',
      {},
      {
        perPage: 5,
        currentPage: 1,
        total: 30,
      }
    );
    expect(await paginator2.lastPage()).toEqual(6);

    const paginator3 = new LengthAwarePaginator(
      db,
      'SELECT * FROM total_tests',
      {},
      {
        perPage: 7,
        currentPage: 1,
        total: 30,
      }
    );
    expect(await paginator3.lastPage()).toEqual(5);

    expect(db.select).not.toHaveBeenCalled();
  });
});
