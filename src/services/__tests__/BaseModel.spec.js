import BaseModel from '../dynamodb/BaseModel';
import LesgoException from '../../exceptions/LesgoException';

const table = 'sampleTable';
const sampleUser = { email: 'test@example.com' };
const userList = [
  { email: 'test1@example.com' },
  { email: 'test2@example.com' },
];

describe('ServicesGroup: test Dynamodb Base Model', () => {
  it('test Base Model constructor', () => {
    const user = new BaseModel(table, {}, sampleUser);
    expect(user.table).toBe(table);
  });

  it('test find function', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    const foundUser = await user.find(sampleUser);
    expect(foundUser.instance).toBe(sampleUser);
  });

  it('test find function - error', async () => {
    const user = new BaseModel(table, {}, {});
    await expect(user.find({})).rejects.toThrow(
      new LesgoException('mockedError', 'DYNAMODB_SAVE_ERROR')
    );
  });

  it('test create function', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    const result = await user.create();
    expect(result).toBe(1);
    expect(user.instance.email).toBe('test@example.com');
  });

  it('test create function - error', async () => {
    const user = new BaseModel(table, {}, {});
    await expect(user.create()).rejects.toStrictEqual(
      new LesgoException('mockedError', 'DYNAMODB_SAVE_ERROR')
    );
  });

  it('test createMany function', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    const result = await user.createMany(userList);
    expect(result).toBe(undefined);
  });

  it('test createMany function - error', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    await expect(user.createMany(null)).rejects.toStrictEqual(
      new LesgoException('mockedError', 'DYNAMODB_SAVEMANY_ERROR')
    );
  });

  it('test update function', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    const result = await user.update({ email: 'test@updated.com' });
    expect(result).toBe(1);
    expect(user.instance.email).toBe('test@updated.com');
  });

  it('test update function - error', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    await expect(user.update(null)).rejects.toStrictEqual(
      new LesgoException('mockedError', 'DYNAMODB_UPDATE_ERROR')
    );
  });

  it('test promiseExec', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    const query = user.Model.query('email').eq('email1@test.com');
    const result = await user.promisedExec(query);
    expect(result[0].email).toBe('test1@example.com');
    expect(result[1].email).toBe('test2@example.com');
  });

  it('test promisedExec - error', async () => {
    const user = new BaseModel(table, {}, sampleUser);
    const query = user.Model.query(null).eq('email1@test.com');
    await expect(user.promisedExec(query)).rejects.toStrictEqual(
      new LesgoException('mockedError', 'DYNAMODB_QUERY_ERROR')
    );
  });
});
