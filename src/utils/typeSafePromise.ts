/**
 *
 * @param promise
 * @returns {success: true, data: TData} | {success: false, error: TError}
 * @reference https://github.com/arthurfiorette/proposal-safe-assignment-operator
 *
 * @example
 * ```typescript
 * import { typeSafePromise } from 'lesgo/utils';
 *
 * const res = await typeSafePromise(fetch('https://example.com/'));
 * if (res.success) {
 *   console.log(res.data);
 * } else {
 *   console.error(res.error);
 * }
 * ```
 */
type ReturnTypeSafePromise<TData, TError> =
  | {
      success: true;
      data: TData;
      error?: undefined;
    }
  | {
      success: false;
      data?: undefined;
      error: TError;
    };

const typeSafePromise = async <TData, TError = Error>(
  promise: Promise<TData>
): Promise<ReturnTypeSafePromise<TData, TError>> => {
  try {
    const res = await promise;
    return {
      success: true,
      data: res,
    };
  } catch (err) {
    return {
      success: false,
      error: err as TError,
    };
  }
};

export default typeSafePromise;
