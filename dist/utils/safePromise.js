var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
/**
 *
 * @param promise
 * @returns [err, res]
 * @reference https://github.com/arthurfiorette/proposal-safe-assignment-operator
 *
 * @example
 * ```typescript
 * import { safePromise } from 'lesgo/utils';
 *
 * const [err, res] = await safePromise(fetch('https://example.com/'));
 * if (err) {
 *   console.error(err);
 * } else {
 *   console.log(res);
 * }
 * ```
 */
const safePromise = promise =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const res = yield promise;
      return [null, res];
    } catch (err) {
      return [err, null];
    }
  });
export default safePromise;
