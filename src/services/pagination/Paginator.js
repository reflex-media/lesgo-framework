import LesgoException from '../../exceptions/LesgoException';
import validateFields from '../../utils/validateFields';

const FILE = 'Services/pagination/Paginator';

export default class Paginator {
  /**
   * Constructor
   *
   * @param db
   * @param sql
   * @param sqlParams
   * @param options
   */
  constructor(db, sql, sqlParams, options = {}) {
    const validFields = [
      { key: 'db', type: 'object', required: true },
      { key: 'sql', type: 'string', required: true },
      { key: 'sqlParams', type: 'object', required: true },
      { key: 'perPage', type: 'number', required: false },
      { key: 'currentPage', type: 'number', required: false },
    ];

    let validated = {};
    try {
      validated = validateFields(
        {
          db,
          sql,
          sqlParams,
          ...options,
        },
        validFields
      );
    } catch (error) {
      throw new LesgoException(
        error.message,
        `${FILE}::FIELD_VALIDATION_EXCEPTION`,
        500,
        {
          ...options,
          error,
        }
      );
    }

    const { perPage, currentPage } = validated;

    this.dbProp = db;
    this.sqlProp = sql;
    this.sqlParamsProp = sqlParams;
    this.perPageProp = perPage || 10;
    this.currentPageProp = currentPage || 1;

    this.hasNext = false;

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
   * Previous page
   *
   * @returns {boolean|number}
   */
  previousPage() {
    if (this.currentPage() > 1) {
      return this.currentPage() - 1;
    }

    return false;
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
   * Next page
   *
   * @returns {Promise<boolean|*>}
   */
  async nextPage() {
    if (this.response.length <= 0) {
      await this.executeQuery();
    }

    if (this.hasNext) {
      return this.currentPage() + 1;
    }

    return false;
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
   * Get the last page.
   *
   * @returns {Promise<number>}
   */
  async lastPage() {
    return this.calculateTotalNumberOfPages();
  }

  /**
   * Total items in all pages.
   *
   * @returns {null|number}
   */
  async total() {
    return this.countTotalItems();
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
      previous_page: this.previousPage(),
      current_page: this.currentPage(),
      next_page: await this.nextPage(),
      last_page: await this.lastPage(),
      per_page: this.perPage(),
      total: await this.total(),
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
    const limitWithExtraData = values.limit + 1;
    return this.sqlProp.concat(
      ` LIMIT ${limitWithExtraData} OFFSET ${values.offset}`
    );
  }

  async executeQuery() {
    this.response = await this.dbProp.select(
      this.generatePaginationSqlSnippet(),
      this.sqlParamsProp
    );

    this.hasNext = this.response.length > this.perPage();
    if (this.hasNext) {
      this.response.pop();
    }

    return this.response;
  }

  /**
   * Count total items with basic implementation.
   *
   * @returns {Promise<number>}
   */
  async countTotalItems() {
    const resp = await this.dbProp.select(this.sqlProp, this.sqlParamsProp);
    return Object.keys(resp).length;
  }

  async calculateTotalNumberOfPages() {
    const total = await this.total();
    return Math.ceil(total / this.perPage());
  }
}
