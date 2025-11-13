import formatUnixTimestamp from '../formatUnixTimestamp';

describe('formatUnixTimestamp', () => {
  it('should format Unix epoch (0) correctly', () => {
    const result = formatUnixTimestamp(0);
    expect(result).toBe('1970-01-01 00:00:00');
  });

  it('should format a known timestamp correctly', () => {
    // 2024-01-15 14:30:45 UTC
    const timestamp = 1705329045;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2024-01-15 14:30:45');
  });

  it('should format single-digit months, days, hours, minutes, and seconds with leading zeros', () => {
    // 2024-01-05 03:07:09 UTC
    const timestamp = 1704424029;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2024-01-05 03:07:09');
  });

  it('should format double-digit values correctly', () => {
    // 2024-12-25 23:59:59 UTC
    const timestamp = 1735171199;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2024-12-25 23:59:59');
  });

  it('should format midnight correctly', () => {
    // 2024-06-15 00:00:00 UTC
    const timestamp = 1718409600;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2024-06-15 00:00:00');
  });

  it('should format end of day correctly', () => {
    // 2024-06-15 23:59:59 UTC
    const timestamp = 1718495999;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2024-06-15 23:59:59');
  });

  it('should format leap year date correctly', () => {
    // 2024-02-29 12:00:00 UTC (leap year)
    const timestamp = 1709208000;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2024-02-29 12:00:00');
  });

  it('should format different year correctly', () => {
    // 2000-01-01 00:00:00 UTC
    const timestamp = 946684800;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2000-01-01 00:00:00');
  });

  it('should format future date correctly', () => {
    // 2030-12-31 23:59:59 UTC
    const timestamp = 1924991999;
    const result = formatUnixTimestamp(timestamp);
    expect(result).toBe('2030-12-31 23:59:59');
  });

  it('should use UTC timezone (not local time)', () => {
    // Use a timestamp that would differ significantly between UTC and local time
    // 2024-01-01 12:00:00 UTC
    const timestamp = 1704110400;
    const result = formatUnixTimestamp(timestamp);

    // Verify it's UTC by checking the date object
    const date = new Date(timestamp * 1000);
    const expectedYear = date.getUTCFullYear();
    const expectedMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
    const expectedDay = String(date.getUTCDate()).padStart(2, '0');
    const expectedHours = String(date.getUTCHours()).padStart(2, '0');
    const expectedMinutes = String(date.getUTCMinutes()).padStart(2, '0');
    const expectedSeconds = String(date.getUTCSeconds()).padStart(2, '0');
    const expected = `${expectedYear}-${expectedMonth}-${expectedDay} ${expectedHours}:${expectedMinutes}:${expectedSeconds}`;

    expect(result).toBe(expected);
    expect(result).toBe('2024-01-01 12:00:00');
  });

  it('should handle timestamp with milliseconds precision (truncated)', () => {
    // Even if timestamp has decimal places, it should work
    // JavaScript Date constructor will handle it
    const timestamp = 1705332645.123;
    const result = formatUnixTimestamp(timestamp);
    // Should still format correctly (fractional seconds are ignored in Unix timestamps)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });
});
