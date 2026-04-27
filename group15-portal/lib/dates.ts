/** Days from local start-of-today until end (inclusive-style countdown to due date). */
export function daysRemainingUntilDueDate(isoYear: number, monthIndex: number, day: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(isoYear, monthIndex, day);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function countdownLabel(days: number): string {
  if (days < 0) return "Past due";
  if (days === 0) return "Due today";
  if (days === 1) return "1 day remaining";
  return `${days} days remaining`;
}
