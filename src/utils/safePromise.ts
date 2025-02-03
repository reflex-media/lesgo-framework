/**
 *
 * @param promise
 * @returns {isSuccess: true, data: TData, error: undefined} | {isSuccess: false, data: undefined, error: TError}
 * @reference https://github.com/arthurfiorette/proposal-safe-assignment-operator
 *
 * @example
 * ```typescript
 * import { safePromise } from 'lesgo/utils';
 *
 * const res = await safePromise(fetch('https://example.com/'));
 * if (res.isSuccess) {
 *   console.log(res.data);
 * } else {
 *   console.error(res.error);
 * }
 * ```
 */
type ReturnTypeSafePromise<TData, TError> =
  | {
      isSuccess: true;
      data: TData;
      error?: undefined;
    }
  | {
      isSuccess: false;
      data?: undefined;
      error: TError;
    };

const safePromise = async <TData, TError = Error>(
  promise: Promise<TData>
): Promise<ReturnTypeSafePromise<TData, TError>> => {
  try {
    const res = await promise;
    return {
      isSuccess: true,
      data: res,
    };
  } catch (err) {
    return {
      isSuccess: false,
      error: err as TError,
    };
  }
};

export default safePromise;
