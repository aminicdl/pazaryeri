/**
 * API Base Service
 * Provides base configuration and error handling for all API calls
 * Requirements: 6.2
 */

import type { APIError } from '@/types/common';

/**
 * Base API configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.meshur.co';

/**
 * Default request options
 */
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: Record<string, string>;

  constructor(message: string, code: string, status: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Handles API error responses and transforms them into APIError objects
 */
export function handleAPIError(error: unknown): APIError {
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Response) {
    return {
      code: `HTTP_${error.status}`,
      message: error.statusText || 'An error occurred',
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
  };
}

/**
 * Parses API response and handles errors
 */
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { message?: string; code?: string; details?: Record<string, string> } = {};
    
    try {
      errorData = await response.json();
    } catch {
      // Response body is not JSON
    }

    throw new ApiError(
      errorData.message || response.statusText || 'Request failed',
      errorData.code || `HTTP_${response.status}`,
      response.status,
      errorData.details
    );
  }

  return response.json();
}

/**
 * Makes a GET request to the API
 */
export async function apiGet<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    method: 'GET',
  });

  return parseResponse<T>(response);
}

/**
 * Makes a POST request to the API
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  return parseResponse<T>(response);
}

/**
 * Makes a PUT request to the API
 */
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  return parseResponse<T>(response);
}

/**
 * Makes a DELETE request to the API
 */
export async function apiDelete<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    method: 'DELETE',
  });

  return parseResponse<T>(response);
}

/**
 * Builds query string from parameters object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
