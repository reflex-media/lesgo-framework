import LengthAwarePaginator from '../services/pagination/LengthAwarePaginator';
import Paginator from '../services/pagination/Paginator';

export const paginatorFactory = async (
  sql,
  sqlParams,
  perPage,
  currentPage = null,
  total = null
) => {
  let paginator;
  if (total !== null) {
    paginator = new LengthAwarePaginator(
      sql,
      sqlParams,
      perPage,
      currentPage,
      total
    );
  } else {
    paginator = new Paginator(sql, sqlParams, perPage, currentPage);
  }

  return paginator;
};

export const paginate = async (
  sql,
  sqlParams,
  perPage,
  currentPage = null,
  total = null
) => {
  const paginator = paginatorFactory(
    sql,
    sqlParams,
    perPage,
    currentPage,
    total
  );
  return (await paginator).toObject();
};

export default {
  paginatorFactory,
  paginate,
};
