/**
 *
 * @param promise
 * @returns [error, data]
 *
 * @example
 * const [error, data] = await safePromise(fetch('https://jsonplaceholder.typicode.com/todos/1'));
 * if (error) {
 *  console.error(error);
 * } else {
 * console.log(data);
 * }
 */
const safePromise = async <T>(
  promise: Promise<T>
): Promise<[unknown, T | null]> => {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error, null];
  }
};

export default safePromise;
