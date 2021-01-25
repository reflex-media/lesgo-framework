import db from './db';
import LesgoException from '../exceptions/LesgoException';

const FILE = 'Utils/paginate';

/**
 * Calculate LIMIT and OFFSET by page number and number of contents per page.
 *
 * This method is very specific to the use of LIMIT and OFFSET in SQL to create a pagination.
 *
 * @param page
 * @param perPage
 * @returns {{offset: number, limit}}
 */
export const getLimitAndOffsetByPageAndContentPerPage = (page, perPage) => {
  if (typeof page === 'undefined') {
    throw new LesgoException(
      "Missing required 'page'",
      `${FILE}::MISSING_REQUIRED_PAGE`,
      500,
      { page }
    );
  }

  if (typeof page !== 'number') {
    throw new LesgoException(
      "Invalid type for 'page'",
      `${FILE}::INVALID_TYPE_PAGE`,
      500,
      { page }
    );
  }

  if (typeof perPage === 'undefined') {
    throw new LesgoException(
      "Missing required 'perPage'",
      `${FILE}::MISSING_REQUIRED_PER_PAGE`,
      500,
      { perPage }
    );
  }

  if (typeof perPage !== 'number') {
    throw new LesgoException(
      "Invalid type for 'perPage'",
      `${FILE}::INVALID_TYPE_PER_PAGE`,
      500,
      { perPage }
    );
  }

  const offset = page * perPage - perPage;
  const limit = perPage;

  return {
    offset,
    limit,
  };
};

/**
 * Get total number of contents.
 *
 * @param sql
 * @param sqlParams
 * @returns {Promise<void>}
 */
export const countData = async (sql, sqlParams) => {
  const resp = await db.select(sql, sqlParams);
  return Object.keys(resp).length;
};

/**
 * Calculate total number of pages.
 *
 * @param count
 * @param perPage
 * @returns {number}
 */
export const calculateTotalNumberOfPages = (count, perPage) => {
  return Math.ceil(count / perPage);
};

/**
 * Generate Pagination SQL Snippet.
 *
 * @param sql
 * @param page
 * @param perPage
 * @returns {*}
 */
export const generatePaginationSqlSnippet = (sql, page, perPage) => {
  const values = getLimitAndOffsetByPageAndContentPerPage(page, perPage);
  return sql.concat(` LIMIT ${values.limit} OFFSET ${values.offset}`);
};

/**
 * Paginate Helper.
 *
 * @param sql
 * @param sqlParams
 * @param perPage
 * @param page
 * @returns {Promise<{pagination: {has_previous_page: boolean, next_page: number, has_next_page: *, num_items, num_pages: *, previous_page: number, current_page: number}, data: Promise<*>}>}
 */
export const paginate = async (sql, sqlParams, perPage, page) => {
  // Default page number
  if (typeof page === 'undefined' || typeof page !== 'number') {
    // eslint-disable-next-line no-param-reassign
    page = 1;
  }

  // Take advantage of the validation it provides
  const resp = db.select(
    generatePaginationSqlSnippet(sql, page, perPage),
    sqlParams
  );

  const allItemsCount = await countData(sql, sqlParams);
  const pages = calculateTotalNumberOfPages(allItemsCount, perPage);

  return {
    data: resp,
    pagination: {
      current_page: page,
      has_next_page: page < pages,
      has_previous_page: page > pages,
      next_page: page + (page < pages),
      num_items: perPage,
      num_pages: pages,
      previous_page: page - (page > pages),
    },
  };
};

export default {
  paginate,
  generatePaginationSqlSnippet,
  getLimitAndOffsetByPageAndContentPerPage,
  countData,
  calculateTotalNumberOfPages,
};
