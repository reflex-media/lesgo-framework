import LengthAwarePaginator from '../services/pagination/LengthAwarePaginator';
import Paginator from '../services/pagination/Paginator';

/**
 * Create the necessary pagination instance.
 *
 * @param db
 * @param sql
 * @param sqlParams
 * @param perPage
 * @param currentPage
 * @param total - (bool) true, to automatically find the total data. (int) number to supply the total data manually.
 * @returns {Paginator|LengthAwarePaginator}
 */
export const paginatorFactory = (
  db,
  sql,
  sqlParams,
  perPage,
  currentPage = null,
  total = null
) => {
  let paginator;
  if (total === true || typeof total === 'number') {
    paginator = new LengthAwarePaginator(
      db,
      sql,
      sqlParams,
      perPage,
      currentPage,
      typeof total === 'number' ? total : null
    );
  } else {
    paginator = new Paginator(db, sql, sqlParams, perPage, currentPage);
  }

  return paginator;
};

/**
 * Create paginated return object.
 *
 * @param db
 * @param sql
 * @param sqlParams
 * @param perPage
 * @param currentPage
 * @param total - (bool) true, to automatically find the total data. (int) number to supply the total data manually.
 * @returns {object}
 */
export const paginate = async (
  db,
  sql,
  sqlParams,
  perPage,
  currentPage = null,
  total = null
) => {
  const paginator = paginatorFactory(
    db,
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
