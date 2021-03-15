import Paginator from './Paginator';
import LesgoException from '../../exceptions/LesgoException';

const FILE = 'Services/pagination/LengthAwarePaginator';

export default class LengthAwarePaginator extends Paginator {
  /**
   * Constructor
   *
   * @param db
   * @param sql
   * @param sqlParams
   * @param perPage
   * @param currentPage
   * @param total
   */
  constructor(db, sql, sqlParams, perPage = 10, currentPage = 1, total) {
    if (typeof total !== 'number') {
      throw new LesgoException(
        "Invalid type for 'total'",
        `${FILE}::INVALID_TYPE_TOTAL`,
        500,
        { perPage }
      );
    }
    super(db, sql, sqlParams, perPage, currentPage);
    this.totalProp = total;
  }

  /**
   * Total items in all pages.
   *
   * @returns {null|number}
   */
  async total() {
    return this.totalProp;
  }
}
