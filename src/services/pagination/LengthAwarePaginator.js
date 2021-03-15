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
   */
  constructor(db, sql, sqlParams, options) {
    const validFields = [
      { key: 'db', type: 'object', required: true },
      { key: 'sql', type: 'string', required: true },
      { key: 'sqlParams', type: 'object', required: true },
      { key: 'total', type: 'number', required: true },
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

    const { total } = validated;

    super(db, sql, sqlParams, options);
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
