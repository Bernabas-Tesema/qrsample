import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('en-ET')} ETB`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}...`;
}

export function getImageUrl(path: string | null | undefined, fallback?: string): string {
  if (!path) return fallback || '/images/placeholder-food.svg';
  if (path.startsWith('http')) return path;
  return path;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export function parseIngredients(description: string | null | undefined): string[] {
  if (!description || isPricingDescription(description)) return [];
  return description
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

export function isPricingDescription(description: string | null | undefined): boolean {
  if (!description) return false;
  return (
    description.includes('Bottle:') ||
    description.includes('Price on request') ||
    description.includes('ETB |')
  );
}

export function capitalizeDay(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}
