/**
 * Timezone-safe local calendar date utilities.
 * Ensures user activity is always anchored to their local calendar day (YYYY-MM-DD),
 * avoiding premature or delayed day rollovers caused by UTC midnight.
 */

/**
 * Returns the YYYY-MM-DD string formatted in the user's LOCAL calendar date.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD string safely into a local Date object at midnight.
 */
export function parseLocalDateString(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Checks if a given YYYY-MM-DD string is today's local date.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getLocalDateString();
}

/**
 * Checks if a given YYYY-MM-DD string was yesterday's local date.
 */
export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === getLocalDateString(yesterday);
}

/**
 * Gets yesterday's local date string.
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
}

/**
 * Formats a YYYY-MM-DD date string nicely.
 * Examples: "Today", "Yesterday", "Mon, Aug 31", "August 31, 2026".
 */
export function formatDateDisplay(
  dateStr: string,
  options?: { relative?: boolean; includeYear?: boolean; weekday?: 'short' | 'long' }
): string {
  if (options?.relative) {
    if (isToday(dateStr)) return 'Today';
    if (isYesterday(dateStr)) return 'Yesterday';
  }

  const date = parseLocalDateString(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: options?.weekday,
    month: 'short',
    day: 'numeric',
    year: options?.includeYear ? 'numeric' : undefined,
  });
}

/**
 * Formats a full date for tooltips & modals (e.g. "Monday, August 31, 2026").
 */
export function formatFullDateDisplay(dateStr: string): string {
  const date = parseLocalDateString(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats focus minutes into readable hours and minutes (e.g. 155 -> "2h 35m", 45 -> "45m").
 */
export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}
