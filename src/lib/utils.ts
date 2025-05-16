import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDigit(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  };
  return new Date(date).toLocaleDateString('id-ID', options);
}
