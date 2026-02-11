import { format, formatDistanceToNow, parseISO, isAfter, isBefore, addDays, addWeeks, addMonths } from 'date-fns';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function isUpcoming(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(d, new Date());
}

export function isPast(date: string | Date): boolean {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(d, new Date());
}

export function getNextOccurrence(date: string, recurrence: string): Date {
  const d = parseISO(date);
  switch (recurrence) {
    case 'weekly':
      return addWeeks(d, 1);
    case 'monthly':
      return addMonths(d, 1);
    default:
      return d;
  }
}

export function toInputDatetime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function getDefaultReminder(eventDate: string): Date {
  const d = parseISO(eventDate);
  return addDays(d, -1);
}
