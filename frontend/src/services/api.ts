/**
 * MEDVERITY Core API Client & Configuration
 * Provides configurable base URLs, error normalization, and fallback to Mock Data
 */

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isMockEnabled: true, // Default to true until backend server is connected
};

export class ApiError extends Error {
  constructor(public message: string, public status?: number, public details?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Retrieve token from localStorage if logged in
  const token = localStorage.getItem('medverity_token');
  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.detail) {
          errorMessage = typeof errorBody.detail === 'string' ? errorBody.detail : JSON.stringify(errorBody.detail);
        }
      } catch {
        // Fall back to default error text
      }
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Network communication failure';
    throw new ApiError(message);
  }
}
