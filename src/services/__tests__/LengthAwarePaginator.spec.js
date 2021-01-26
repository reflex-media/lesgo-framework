import LengthAwarePaginator from '../pagination/LengthAwarePaginator';
import {
  mockData,
  mockDataFirstItem,
  mockDataLastItem,
} from '../../utils/__mocks__/db';
import LesgoException from '../../exceptions/LesgoException';
import db from '../../utils/db';

jest.mock('../../utils/db');

beforeEach(() => {
  db.select.mockClear();
});

const FILE = 'Services/pagination/LengthAwarePaginator';

describe('test LengthAwarePaginator instantiate', () => {
  it('should not throw exception when instantiating', async () => {
    const paginator = new LengthAwarePaginator('SELECT * FROM tests', {}, 5);

    expect(await paginator.count()).toEqual(5);
    expect(paginator.currentPage()).toEqual(1);
    expect(await paginator.firstItem()).toMatchObject(mockDataFirstItem);
    expect(await paginator.lastItem()).toMatchObject(mockDataLastItem);
    expect(paginator.perPage()).toEqual(5);
    expect(await paginator.total()).toEqual(10);
  });
  it('should not throw exception when instantiating with current page', async () => {
    const paginator = new LengthAwarePaginator('SELECT * FROM tests', {}, 5, 2);

    expect(await paginator.count()).toEqual(5);
    expect(paginator.currentPage()).toEqual(2);
    expect(await paginator.firstItem()).toMatchObject(mockDataFirstItem);
    expect(await paginator.lastItem()).toMatchObject(mockDataLastItem);
    expect(paginator.perPage()).toEqual(5);
    expect(await paginator.total()).toEqual(10);
  });
  it('should throw exception if total is not a number', async () => {
    try {
      expect(
        new LengthAwarePaginator('SELECT * FROM tests', {}, 5, 1, 'test')
      ).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          "Invalid type for 'total'",
          `${FILE}::INVALID_TYPE_TOTAL`
        )
      );
    }
  });
  it('should return the object version of the paginator', async () => {
    const paginator = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      5
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
  });
});

describe('test total() usage', () => {
  it('should get total number of data using default countTotalItems method', async () => {
    const paginator = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      10,
      1
    );

    expect(await paginator.total()).toEqual(30);
    expect(db.select).toHaveBeenCalled();
  });
  it('should get total number of data using supplied paramater', async () => {
    const paginator = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      10,
      1,
      30
    );

    expect(await paginator.total()).toEqual(30);
    expect(db.select).not.toHaveBeenCalled();
  });
});

describe('test lastPage() usage', () => {
  it('should get the last page using default countTotalItems method when getting total data', async () => {
    const paginator1 = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      10,
      1
    );
    expect(await paginator1.lastPage()).toEqual(3);

    const paginator2 = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      5,
      1
    );
    expect(await paginator2.lastPage()).toEqual(6);

    const paginator3 = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      7,
      1
    );
    expect(await paginator3.lastPage()).toEqual(5);

    expect(db.select).toHaveBeenCalled();
  });
  it('should get the last page using supplied paramater as total data', async () => {
    const paginator1 = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      10,
      1,
      30
    );
    expect(await paginator1.lastPage()).toEqual(3);

    const paginator2 = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      5,
      1,
      30
    );
    expect(await paginator2.lastPage()).toEqual(6);

    const paginator3 = new LengthAwarePaginator(
      'SELECT * FROM total_tests',
      {},
      7,
      1,
      30
    );
    expect(await paginator3.lastPage()).toEqual(5);

    expect(db.select).not.toHaveBeenCalled();
  });
});
