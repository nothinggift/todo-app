import { useAuthStore } from '@/store/authStore'
import { ApiError, QueryOptions } from '@/types'
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
const API_URL = process.env.NEXT_PUBLIC_API_URL

// API client
export const createApiClient = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${useAuthStore.getState().token}`
  }

  const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
      });
  
      if (!response.ok) {
        throw new ApiError(await response.text(), response.status, response.statusText);
      }
  
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  };

  const handleApiError = (error: unknown): never => {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof Error) {
      throw new ApiError(error.message, 500, 'Internal Server Error');
    } else {
      throw new ApiError('An unknown error occurred', 500, 'Internal Server Error');
    }
  };

  return {
    get: <T>(endpoint: string) => 
      fetchApi<T>(`${API_URL}${endpoint}`),
    
    post: <T, D>(endpoint: string, data: D) => 
      fetchApi<T>(`${API_URL}${endpoint}`, { method: 'POST', body: JSON.stringify(data) }),
    
    put: <T, D>(endpoint: string, data: D) => 
      fetchApi<T>(`${API_URL}${endpoint}`, { method: 'PUT', body: JSON.stringify(data) }),
    
    delete: <T>(endpoint: string) => 
      fetchApi<T>(`${API_URL}${endpoint}`, { method: 'DELETE' }),
  }
}

export const useApiQuery = <T>(queryKey: QueryKey, endpoint: string, options?: QueryOptions ) => {
  const api = createApiClient()
  const paramsString = options?.params
    ? `?${new URLSearchParams(Object.entries(options.params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)).toString()}`
    : ''
  return useQuery<T, ApiError>({
    queryKey: queryKey,
    queryFn: () => api.get<T>(endpoint + paramsString),
    enabled: options?.enabled
  })
}

export const useApiMutation = <T, TVariables>(
  mutationFn: (variables: TVariables) => Promise<T>,
  options?: { invalidateQueries?: QueryKey }
) => {
  const queryClient = useQueryClient()
  return useMutation<T, ApiError, TVariables>({
    mutationFn,
    onSuccess: () => {
      if (options?.invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: options.invalidateQueries })
      }
    },
  })
}