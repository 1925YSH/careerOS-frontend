/**
 * AI CareerOS - Enterprise API Client
 * Supports HttpOnly credentials, correlation ID tracking,
 * and unified error extraction conforming to backend error taxonomy.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    category: string;
    message: string;
    details?: any;
  };
  requestId?: string;
}

export class ApiError extends Error {
  category: string;
  statusCode: number;
  details?: any;
  requestId?: string;

  constructor(category: string, message: string, statusCode: number, details?: any, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.category = category;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;
  }
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Ensure HttpOnly session cookies are sent across origins
  };

  const response = await fetch(url, config);
  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      category: 'internal',
      message: 'Failed to parse JSON response from server',
    },
  }));

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error?.category || 'internal',
      data.error?.message || response.statusText || 'An unexpected error occurred',
      response.status,
      data.error?.details,
      data.requestId
    );
  }

  return data.data as T;
}

