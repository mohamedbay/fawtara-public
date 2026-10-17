import { format, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';

/**
 * Format date for display in Arabic
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: 'dd MMM yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatStr: string = 'dd MMM yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ar });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'تاريخ غير صالح';
  }
}

/**
 * Get the current local calendar date for the invoice date field
 * @returns ISO date string
 */
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Sort array by date field
 * @param items - Array of items with date field
 * @param field - Field name containing date
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByDate<T>(
  items: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[field] as any).getTime();
    const dateB = new Date(b[field] as any).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}
