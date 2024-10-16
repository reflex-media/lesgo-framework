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
declare const safePromise: <T>(promise: Promise<T>) => Promise<[unknown, T | null]>;
export default safePromise;
