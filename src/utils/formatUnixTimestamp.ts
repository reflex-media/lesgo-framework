/**
 * Formats a Unix timestamp into a string representation.
 *
 * @param {number} timestamp - The Unix timestamp to format.
 * @returns {string} The formatted timestamp string in UTC in the format "YYYY-MM-DD HH:MM:SS".
 */
const formatUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default formatUnixTimestamp;
