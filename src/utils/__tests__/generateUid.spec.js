import generateUid from '../generateUid';

describe('UtilsGroup: test generateUid utils', () => {
  it('test generating default unique id', async () => {
    const uid = await generateUid();
    expect(uid.length).toEqual(21);
  });

  it('test generating unique id with prefix', async () => {
    const uid = await generateUid({ prefix: 'somePrefix' });
    expect(uid.length).toEqual(32);
    expect(uid.startsWith('somePrefix-')).toBeTruthy();
  });

  it('test generating unique id with suffix', async () => {
    const uid = await generateUid({ suffix: 'someSuffix' });
    expect(uid.length).toEqual(32);
    expect(uid.endsWith('-someSuffix')).toBeTruthy();
  });

  it('test generating unique id with custom length', async () => {
    const uid = await generateUid({ length: 10 });
    expect(uid.length).toEqual(10);
  });

  it('test generating unique id with all parameters', async () => {
    const uid = await generateUid({
      length: 15,
      prefix: 'somePrefix',
      suffix: 'someSuffix',
    });
    expect(uid.length).toEqual(37);
    expect(uid.startsWith('somePrefix-')).toBeTruthy();
    expect(uid.endsWith('-someSuffix')).toBeTruthy();
  });
});
