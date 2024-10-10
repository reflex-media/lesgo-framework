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
const safePromise = async <T>(
  promise: Promise<T>
): Promise<[unknown, T | null]> => {
  try {
    const res = await promise;
    return [null, res];
  } catch (err) {
    return [err, null];
  }
};

export default safePromise;
