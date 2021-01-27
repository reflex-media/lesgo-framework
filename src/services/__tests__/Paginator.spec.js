import Paginator from '../pagination/Paginator';
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

const FILE = 'Services/pagination/Paginator';

describe('test Paginator instantiate', () => {
  it('should not throw exception when instantiating', async () => {
    const paginator = new Paginator(db, 'SELECT * FROM tests', {}, 5);

    expect(await paginator.count()).toEqual(5);
    expect(paginator.currentPage()).toEqual(1);
    expect(await paginator.firstItem()).toMatchObject(mockDataFirstItem);
    expect(await paginator.lastItem()).toMatchObject(mockDataLastItem);
    expect(paginator.perPage()).toEqual(5);
  });
  it('should throw exception if perPage is undefined', async () => {
    try {
      expect(new Paginator(db, 'SELECT * FROM tests', {})).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          "Missing required 'perPage'",
          `${FILE}::MISSING_REQUIRED_PER_PAGE`
        )
      );
    }
  });
  it('should throw exception if perPage is not a number', async () => {
    try {
      expect(new Paginator(db, 'SELECT * FROM tests', {}, 'test')).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          "Invalid type for 'perPage'",
          `${FILE}::INVALID_TYPE_PER_PAGE`
        )
      );
    }
  });
  it('should throw exception if currentPage is not a number', async () => {
    try {
      expect(new Paginator(db, 'SELECT * FROM tests', {}, 5, 'test')).toThrow();
    } catch (err) {
      expect(err).toMatchObject(
        new LesgoException(
          "Invalid type for 'currentPage'",
          `${FILE}::INVALID_TYPE_CURRENT_PAGE`
        )
      );
    }
  });
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
      per_page: 5,
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
