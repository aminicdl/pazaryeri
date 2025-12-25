/**
 * Common type definitions shared across the application
 */

export type Locale = 'tr' | 'en';

export type Theme = 'light' | 'dark' | 'system';

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface APIResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface NormalizedState<T> {
  byId: Record<string, T>;
  allIds: string[];
}

/**
 * Utility types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
