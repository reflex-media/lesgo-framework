import {
  generatePaginationSqlSnippet,
  getLimitAndOffsetByPageAndContentPerPage,
} from '../paginate';

const FILE = 'Utils/paginate';

describe('test pagination getLimitAndOffsetByPageAndContentPerPage', () => {
  it('should return an object containing limit and offset', () => {
    const expected = {
      limit: 10,
      offset: 10,
    };
    const values = getLimitAndOffsetByPageAndContentPerPage(2, 10);
    expect(values).toMatchObject(expected);
  });

  it('should throw an exception if page is undefined', () => {
    try {
      const values = getLimitAndOffsetByPageAndContentPerPage();
      expect(values).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual("Missing required 'page'");
      expect(err.code).toEqual(`${FILE}::MISSING_REQUIRED_PAGE`);
      expect(err.statusCode).toEqual(500);
    }
  });

  it('should throw an exception if page is not a number', () => {
    try {
      const values = getLimitAndOffsetByPageAndContentPerPage('sample', 10);
      expect(values).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual("Invalid type for 'page'");
      expect(err.code).toEqual(`${FILE}::INVALID_TYPE_PAGE`);
      expect(err.statusCode).toEqual(500);
    }
  });

  it('should throw an exception if perPage is undefined', () => {
    try {
      const values = getLimitAndOffsetByPageAndContentPerPage(1);
      expect(values).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual("Missing required 'perPage'");
      expect(err.code).toEqual(`${FILE}::MISSING_REQUIRED_PER_PAGE`);
      expect(err.statusCode).toEqual(500);
    }
  });

  it('should throw an exception if perPage is not a number', () => {
    try {
      const values = getLimitAndOffsetByPageAndContentPerPage(1, 'sample');
      expect(values).toThrow();
    } catch (err) {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual("Invalid type for 'perPage'");
      expect(err.code).toEqual(`${FILE}::INVALID_TYPE_PER_PAGE`);
      expect(err.statusCode).toEqual(500);
    }
  });
});

describe('test pagination generatePaginationSqlSnippet', () => {
  it('should return a SQL snippet containing limit and offset code', () => {
    const sql = generatePaginationSqlSnippet('SELECT * FROM test', 3, 10);
    expect(sql).toMatch(`SELECT * FROM test LIMIT 10 OFFSET 20`);
  });
});
