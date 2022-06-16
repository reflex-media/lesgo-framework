import Paginator from './Paginator';
import LesgoException from '../../exceptions/LesgoException';
import validateFields from '../../utils/validateFields';

const FILE = 'Services/pagination/LengthAwarePaginator';

export default class LengthAwarePaginator extends Paginator {
  /**
   * Constructor
   *
   * @param db
   * @param sql
   * @param sqlParams
   * @param options
   * @param connection
   */
  constructor(db, sql, sqlParams, options, connection = {}) {
    const validFields = [{ key: 'total', type: 'number', required: true }];

    let validated = {};
    try {
      validated = validateFields(options, validFields);
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

    const { total } = validated;

    super(db, sql, sqlParams, options, connection);
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
