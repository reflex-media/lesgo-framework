import Paginator from './Paginator';
import LesgoException from '../../exceptions/LesgoException';
import db from '../../utils/db';

const FILE = 'Services/pagination/LengthAwarePaginator';

export default class LengthAwarePaginator extends Paginator {
  constructor(sql, sqlParams, perPage, currentPage = null, total = null) {
    if (total !== null && typeof total !== 'number') {
      throw new LesgoException(
        "Invalid type for 'total'",
        `${FILE}::INVALID_TYPE_TOTAL`,
        500,
        { perPage }
      );
    }
    super(sql, sqlParams, perPage, currentPage);
    this.totalProp = total;
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
    if (this.totalProp === null) {
      this.totalProp = await this.countTotalItems();
    }

    return this.totalProp;
  }

  // They act as protected methods.

  /**
   * Count total items with basic implementation.
   *
   * @returns {Promise<number>}
   */
  async countTotalItems() {
    const resp = await db.select(this.sqlProp, this.sqlParamsProp);
    return Object.keys(resp).length;
  }

  async calculateTotalNumberOfPages() {
    const total = await this.total();
    return Math.ceil(total / this.perPage());
  }
}
