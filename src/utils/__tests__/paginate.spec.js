import { paginate, paginatorFactory } from '../paginate';
import db from '../db';

jest.mock('../db');

beforeEach(() => {
  db.select.mockClear();
});

describe('test paginate paginatorFactory', () => {
  it('can create Paginator instance', () => {
    const paginator = paginatorFactory('SELECT * FROM tests', {}, 5);

    expect(paginator).toHaveProperty('count');
    expect(paginator).toHaveProperty('previousPage');
    expect(paginator).toHaveProperty('currentPage');
    expect(paginator).toHaveProperty('nextPage');
    expect(paginator).toHaveProperty('firstItem');
    expect(paginator).toHaveProperty('lastItem');
    expect(paginator).toHaveProperty('perPage');
    expect(paginator).toHaveProperty('items');
    expect(paginator).toHaveProperty('toObject');

    expect(paginator).not.toHaveProperty('lastPage');
    expect(paginator).not.toHaveProperty('total');

    const paginator2 = paginatorFactory('SELECT * FROM tests', {}, 5, 1);

    expect(paginator2).toHaveProperty('count');
    expect(paginator2).toHaveProperty('previousPage');
    expect(paginator2).toHaveProperty('currentPage');
    expect(paginator2).toHaveProperty('nextPage');
    expect(paginator2).toHaveProperty('firstItem');
    expect(paginator2).toHaveProperty('lastItem');
    expect(paginator2).toHaveProperty('perPage');
    expect(paginator2).toHaveProperty('items');
    expect(paginator2).toHaveProperty('toObject');

    expect(paginator2).not.toHaveProperty('lastPage');
    expect(paginator2).not.toHaveProperty('total');
  });
  it('can create LengthAwarePaginator instance', async () => {
    const paginator = paginatorFactory('SELECT * FROM tests', {}, 5, 1, true);

    expect(paginator).toHaveProperty('count');
    expect(paginator).toHaveProperty('previousPage');
    expect(paginator).toHaveProperty('currentPage');
    expect(paginator).toHaveProperty('nextPage');
    expect(paginator).toHaveProperty('firstItem');
    expect(paginator).toHaveProperty('lastItem');
    expect(paginator).toHaveProperty('perPage');
    expect(paginator).toHaveProperty('items');
    expect(paginator).toHaveProperty('toObject');

    expect(paginator).toHaveProperty('lastPage');
    expect(paginator).toHaveProperty('total');

    const paginator2 = paginatorFactory(
      'SELECT * FROM tests',
      {},
      5,
      null,
      true
    );

    expect(paginator2).toHaveProperty('count');
    expect(paginator2).toHaveProperty('previousPage');
    expect(paginator2).toHaveProperty('currentPage');
    expect(paginator2).toHaveProperty('nextPage');
    expect(paginator2).toHaveProperty('firstItem');
    expect(paginator2).toHaveProperty('lastItem');
    expect(paginator2).toHaveProperty('perPage');
    expect(paginator2).toHaveProperty('items');
    expect(paginator2).toHaveProperty('toObject');

    expect(paginator2).toHaveProperty('lastPage');
    expect(paginator2).toHaveProperty('total');

    const paginator3 = paginatorFactory('SELECT * FROM tests', {}, 5, null, 30);

    expect(paginator3).toHaveProperty('count');
    expect(paginator3).toHaveProperty('previousPage');
    expect(paginator3).toHaveProperty('currentPage');
    expect(paginator3).toHaveProperty('nextPage');
    expect(paginator3).toHaveProperty('firstItem');
    expect(paginator3).toHaveProperty('lastItem');
    expect(paginator3).toHaveProperty('perPage');
    expect(paginator3).toHaveProperty('items');
    expect(paginator3).toHaveProperty('toObject');

    expect(paginator3).toHaveProperty('lastPage');
    expect(paginator3).toHaveProperty('total');
  });
});

describe('test paginate function', () => {
  it('can create Paginator converted object', async () => {
    const obj = await paginate('SELECT * FROM tests', {}, 5);
    expect(obj).toHaveProperty('count');
    expect(obj).toHaveProperty('previous_page');
    expect(obj).toHaveProperty('current_page');
    expect(obj).toHaveProperty('next_page');
    expect(obj).toHaveProperty('per_page');
    expect(obj).toHaveProperty('items');

    expect(obj).not.toHaveProperty('last_page');
    expect(obj).not.toHaveProperty('total');
  });
  it('can create LengthAwarePaginator converted object', async () => {
    const obj = await paginate('SELECT * FROM tests', {}, 5, 1, true);
    expect(obj).toHaveProperty('count');
    expect(obj).toHaveProperty('previous_page');
    expect(obj).toHaveProperty('current_page');
    expect(obj).toHaveProperty('next_page');
    expect(obj).toHaveProperty('per_page');
    expect(obj).toHaveProperty('items');

    expect(obj).toHaveProperty('last_page');
    expect(obj).toHaveProperty('total');
  });
});
