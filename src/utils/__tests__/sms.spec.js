import sms, { send } from '../sms';

describe('UtilsGroup: test sms utils', () => {
  it('should call SNSService sendSMS', async () => {
    const sendSMSSpy = jest.spyOn(sms, 'sendSMS');

    await send('+639164317389', 'This is a message');

    expect(sendSMSSpy).toHaveBeenCalledWith(
      '+639164317389',
      'This is a message',
      undefined
    );
  });
});
