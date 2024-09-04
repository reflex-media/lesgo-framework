/**
 * Returns the current timestamp in seconds.
 *
 * @returns The current timestamp in seconds.
 */
const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

export default getCurrentTimestamp;
