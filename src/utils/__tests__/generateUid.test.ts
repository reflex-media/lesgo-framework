import generateUid from '../generateUid';

describe('generateUid', () => {
  it('should generate a UID with default length', () => {
    const uid = generateUid();
    expect(uid).toHaveLength(21);
  });

  it('should generate a UID with specified length', () => {
    const uid = generateUid({ length: 10 });
    expect(uid).toHaveLength(10);
  });

  it('should generate a UID with prefix', () => {
    const uid = generateUid({ prefix: 'prefix' });
    expect(uid).toMatch(/^prefix-/);
  });

  it('should generate a UID with suffix', () => {
    const uid = generateUid({ suffix: 'suffix' });
    expect(uid).toMatch(/-suffix$/);
  });

  it('should generate a UID with prefix and suffix', () => {
    const uid = generateUid({ prefix: 'prefix', suffix: 'suffix' });
    expect(uid).toMatch(/^prefix-.*-suffix$/);
  });
});
