import db from '../../utils/db';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'Services/pagination/Paginator';

export default class Paginator {
  /**
   * Constructor
   *
   * @param sql
   * @param sqlParams
   * @param perPage
   * @param currentPage
   */
  constructor(sql, sqlParams, perPage, currentPage = null) {
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
    if (currentPage !== null && typeof currentPage !== 'number') {
      throw new LesgoException(
        "Invalid type for 'currentPage'",
        `${FILE}::INVALID_TYPE_CURRENT_PAGE`,
        500,
        { currentPage }
      );
    }

    this.sqlProp = sql;
    this.sqlParamsProp = sqlParams;
    this.perPageProp = perPage;
    this.currentPageProp = currentPage || 1;

    this.response = [];
  }

  /**
   * Count all items in the current page.
   *
   * @returns {number}
   */
  async count() {
    if (this.response.length <= 0) {
      await this.executeQuery();
    }
    return this.response.length;
  }

  /**
   * The current page.
   *
   * @returns {*|number}
   */
  currentPage() {
    return this.currentPageProp;
  }

  /**
   * First item in the current page.
   *
   * @returns {*}
   */
  async firstItem() {
    if (this.response.length <= 0) {
      await this.executeQuery();
    }

    return this.response[0];
  }

  /**
   * Last item in the current page.
   */
  async lastItem() {
    if (this.response.length <= 0) {
      await this.executeQuery();
    }

    return this.response[this.response.length - 1];
  }

  /**
   * Number of items per page.
   *
   * @returns {*}
   */
  perPage() {
    return this.perPageProp;
  }

  /**
   * All items in the current page.
   *
   * @returns {[]}
   */
  async items() {
    if (this.response.length <= 0) {
      await this.executeQuery();
    }

    return this.response;
  }

  /**
   * Convert to object.
   *
   * @returns {Promise<{per_page: *, count: *, items: *, current_page: (*|number)}>}
   */
  async toObject() {
    if (this.response.length <= 0) {
      await this.executeQuery();
    }

    return {
      count: await this.count(),
      current_page: this.currentPage(),
      per_page: this.perPage(),
      items: await this.items(),
    };
  }

  // They act as protected methods.

  getLimitAndOffsetByPageAndContentPerPage() {
    const offset = this.currentPage() * this.perPage() - this.perPage();
    const limit = this.perPage();

    return {
      offset,
      limit,
    };
  }

  generatePaginationSqlSnippet() {
    const values = this.getLimitAndOffsetByPageAndContentPerPage();
    return this.sqlProp.concat(
      ` LIMIT ${values.limit} OFFSET ${values.offset}`
    );
  }

  async executeQuery() {
    this.response = await db.select(
      this.generatePaginationSqlSnippet(),
      this.sqlParamsProp
    );

    return this.response;
  }
}
