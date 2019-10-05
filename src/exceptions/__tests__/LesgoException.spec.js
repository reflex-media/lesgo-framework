import LesgoException from '../LesgoException';

describe('ExceptionsGroup: test LesgoException', () => {
  it('test LesgoException with extra parameters', () => {
    const lesgoException = new LesgoException(
      'some message',
      'LESGO_EXCEPTION',
      411,
      {
        someParam: 'someValue',
      }
    );

    expect(lesgoException).toMatchObject({
      name: 'LesgoException',
      message: 'some message',
      statusCode: 411,
      code: 'LESGO_EXCEPTION',
      extra: {
        someParam: 'someValue',
      },
    });
  });
});
