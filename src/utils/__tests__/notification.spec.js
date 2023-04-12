import notification, { notify } from '../notification';

describe('UtilsGroup: test notification utils', () => {
  it('should call SNSService sendNotification', async () => {
    const sendNotificationSpy = jest.spyOn(notification, 'sendNotification');

    await notify('arn:1234', JSON.stringify({ message: 'test' }));

    expect(sendNotificationSpy).toHaveBeenCalledWith(
      'arn:1234',
      JSON.stringify({ message: 'test' }),
      undefined
    );
  });
});
