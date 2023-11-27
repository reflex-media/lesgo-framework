import select from './select';
import query from './query';
import update from './update';
import connect, { end } from './connect';
import LengthAwarePaginator from '../pagination/LengthAwarePaginator';
import Paginator from '../pagination/Paginator';

const selectPaginate = async (
  sql,
  sqlParams,
  perPage = 10,
  currentPage = 1,
  total = null,
  connectionOpts = {}
) => {
  const db = {
    select,
    query,
    connect,
    update,
    end,
  };

  let paginator;

  if (typeof total === 'number') {
    paginator = new LengthAwarePaginator(
      db,
      sql,
      sqlParams,
      {
        perPage,
        currentPage,
        total,
      },
      connectionOpts
    );
  } else {
    paginator = new Paginator(
      db,
      sql,
      sqlParams,
      {
        perPage,
        currentPage,
      },
      connectionOpts
    );
  }

  return (await paginator).toObject();
};

export default selectPaginate;
