import Paginator from '../pagination/Paginator';
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

const FILE = 'Services/pagination/Paginator';

describe('test Paginator instantiate', () => {
  it.each`
    page         | perPage      | expectedCount | firstItem            | lastItem
    ${undefined} | ${undefined} | ${10}         | ${mockData}          | ${mockData}
    ${undefined} | ${5}         | ${5}          | ${mockDataFirstItem} | ${mockDataLastItem}
  `(
    'should not throw exception if page is $page and perPage is $perPage',
    async ({ page, perPage, expectedCount, firstItem, lastItem }) => {
      const paginator = new Paginator(
        db,
        'SELECT * FROM tests',
        {},
        perPage,
        page
      );

      expect(await paginator.count()).toEqual(expectedCount);
      expect(paginator.currentPage()).toEqual(1);
      expect(await paginator.firstItem()).toMatchObject(firstItem);
      expect(await paginator.lastItem()).toMatchObject(lastItem);
      expect(paginator.perPage()).toEqual(expectedCount);
      expect(await paginator.total()).toEqual(10);
    }
  );

  it.each`
    page        | perPage     | errorName           | errorMessage                        | errorCode                               | errorStatusCode
    ${'sample'} | ${10}       | ${'LesgoException'} | ${"Invalid type for 'currentPage'"} | ${`${FILE}::INVALID_TYPE_CURRENT_PAGE`} | ${500}
    ${1}        | ${'sample'} | ${'LesgoException'} | ${"Invalid type for 'perPage'"}     | ${`${FILE}::INVALID_TYPE_PER_PAGE`}     | ${500}
  `(
    'should throw $errorMessage when page is $page and perPage is $perPage',
    ({
      page,
      perPage,
      errorName,
      errorMessage,
      errorCode,
      errorStatusCode,
    }) => {
      try {
        const values = new Paginator(
          db,
          'SELECT * FROM tests',
          {},
          perPage,
          page
        );
        expect(values).toThrow();
      } catch (err) {
        expect(err.name).toEqual(errorName);
        expect(err.message).toEqual(errorMessage);
        expect(err.code).toEqual(errorCode);
        expect(err.statusCode).toEqual(errorStatusCode);
      }
    }
  );

  it('should return the first item of the result', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(await paginator.firstItem()).toMatchObject(mockDataFirstItem);
  });
  it('should return the last item of the result', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(await paginator.lastItem()).toMatchObject(mockDataLastItem);
  });
  it('should return the defined per page', () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(paginator.perPage()).toEqual(5);
  });
  it('should return the previous page if exist', () => {
    const paginator1 = new Paginator(db, 'SELECT * FROM tests', {}, 5, 2);
    expect(paginator1.previousPage()).toEqual(1);

    const paginator2 = new Paginator(db, 'SELECT * FROM tests', {}, 5, 1);
    expect(paginator2.previousPage()).toEqual(false);
  });
  it('should return the next page if exist', async () => {
    const paginator1 = new Paginator(db, 'SELECT * FROM tests', {}, 5);
    expect(await paginator1.nextPage()).toEqual(2);

    const paginator2 = new Paginator(db, 'SELECT * FROM tests', {}, 5, 2);
    expect(await paginator2.nextPage()).toEqual(3);

    const paginator3 = new Paginator(db, 'SELECT * FROM tests', {}, 5, 3);
    expect(await paginator3.nextPage()).toEqual(false);
  });
});

describe('test count() usage', () => {
  it('should count number of items of the current page', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(await paginator.count()).toEqual(5);
  });
  it('should only run executeQuery once', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    await paginator.count();
    await paginator.count();
    await paginator.count();
    await paginator.count();
    await paginator.count();

    expect(db.select).toHaveBeenCalledTimes(1);
  });
});

describe('test currentPage() usage', () => {
  it('should return 1 as current page if no currentPage is defined', () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(paginator.currentPage()).toEqual(1);
  });
  it('should return the defined current page on instantiation', () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5, 2);

    expect(paginator.currentPage()).toEqual(2);
  });
});

describe('test items() usage', () => {
  it('should return all results from the current page', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(await paginator.items()).toMatchObject([
      { ...mockDataFirstItem },
      { ...mockData },
      { ...mockData },
      { ...mockData },
      { ...mockDataLastItem },
    ]);
  });

  it('should only run executeQuery once', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    await paginator.items();
    await paginator.items();
    await paginator.items();
    await paginator.items();

    expect(db.select).toHaveBeenCalledTimes(1);
  });
});

describe('test toObject() usage', () => {
  it('should return object version of the paginator', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(await paginator.toObject()).toMatchObject({
      count: 5,
      previous_page: false,
      current_page: 1,
      next_page: 2,
      last_page: 2,
      per_page: 5,
      total: 10,
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
    const paginator = new Paginator(db, 'SELECT * FROM total_tests', {}, 10, 1);

    expect(await paginator.total()).toEqual(30);
    expect(db.select).toHaveBeenCalled();
  });
});

describe('test lastPage() usage', () => {
  it('should get the last page using default countTotalItems method when getting total data', async () => {
    const paginator1 = new Paginator(
      db,
      'SELECT * FROM total_tests',
      {},
      10,
      1
    );
    expect(await paginator1.lastPage()).toEqual(3);

    const paginator2 = new Paginator(db, 'SELECT * FROM total_tests', {}, 5, 1);
    expect(await paginator2.lastPage()).toEqual(6);

    const paginator3 = new Paginator(db, 'SELECT * FROM total_tests', {}, 7, 1);
    expect(await paginator3.lastPage()).toEqual(5);

    expect(db.select).toHaveBeenCalled();
  });
});
