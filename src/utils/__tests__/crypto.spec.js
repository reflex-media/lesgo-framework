import { encrypt, decrypt, hash, hashMD5 } from '../crypto';
import LesgoException from '../../exceptions/LesgoException';

describe('test crypto encrypt', () => {
  it('should return hashed random string', () => {
    return expect(encrypt('test')).toBeTruthy();
  });

  test('should throw an Error when empty sting parameters were passed', () => {
    expect(() => {
      encrypt('');
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on encrypt',
        'CRYPTO_ENCRYPT_EMPTY_PARAMETER'
      )
    );
  });

  test('should throws an Error when null parameters were passed', () => {
    expect(() => {
      encrypt(null);
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on encrypt',
        'CRYPTO_ENCRYPT_EMPTY_PARAMETER'
      )
    );
  });
});

describe('test crypto decrypt', () => {
  test('should throws an Error when empty sting parameters were passed', () => {
    expect(() => {
      decrypt('');
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on decryp',
        'CRYPTO_DECRYPT_EMPTY_PARAMETER'
      )
    );
  });

  test('should throws an Error when null parameters were passed', () => {
    expect(() => {
      decrypt(null);
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on decryp',
        'CRYPTO_DECRYPT_EMPTY_PARAMETER'
      )
    );
  });

  it('should return correct string encrypted', () => {
    const encryptedText = encrypt('test');
    return expect(decrypt(encryptedText)).toBe('test');
  });
});

describe('test crypto hash', () => {
  it('should return hashed value', () => {
    const hashValueOfTest =
      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

    expect(hash('test')).toBeTruthy();
    expect(hash('test')).toBe(hashValueOfTest);
  });

  test('should throws an Error when empty sting parameters were passed', () => {
    expect(() => {
      hash('');
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on hash',
        'CRYPTO_HASH_EMPTY_PARAMETER'
      )
    );
  });

  test('should throws an Error when null parameters were passed', () => {
    expect(() => {
      hash(null);
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on hash',
        'CRYPTO_HASH_EMPTY_PARAMETER'
      )
    );
  });
});

describe('test crypto hashMD5', () => {
  it('should return hashed value', () => {
    const hashValueOfTest = '098f6bcd4621d373cade4e832627b4f6';

    expect(hashMD5('test')).toBeTruthy();
    expect(hashMD5('test')).toBe(hashValueOfTest);
  });

  test('should throws an Error when empty sting parameters were passed', () => {
    expect(() => {
      hashMD5('');
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on hashMD5',
        'CRYPTO_HASHMD5_EMPTY_PARAMETER'
      )
    );
  });

  test('should throws an Error when null parameters were passed', () => {
    expect(() => {
      hashMD5(null);
    }).toThrow(
      new LesgoException(
        'Empty parameter supplied on hashMD5',
        'CRYPTO_HASHMD5_EMPTY_PARAMETER'
      )
    );
  });
});
