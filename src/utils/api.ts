import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'

const API_URL = 'http://localhost:3000'

export interface Todo {
  id: number;
  content: string;
  completed: boolean;
}

export interface ClientTodo extends Todo {
  isNew?: boolean;
}

export interface LoginResponse {
  access_token: string;
}

export interface QueryOptions {
  params?: Record<string, string | number | boolean | undefined>;
  enabled?: boolean;
}

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

// API client
const createApiClient = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${useAuthStore.getState().token}`
  }

  const fetchApi = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    })

    if (!response.ok) {
      throw new ApiError(await response.text(), response.status, response.statusText);
    }

    return response.json()
  }

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

const useApiQuery = <T>(queryKey: QueryKey, endpoint: string, options?: QueryOptions ) => {
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

const useApiMutation = <T, TVariables>(
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

export const useTodos = (queryOptions?: QueryOptions) => {
  return useApiQuery<Todo[]>(['todos'], '/todos', queryOptions)
}

export const usePostTodo = () => {
  const api = createApiClient()
  return useApiMutation<Todo, Omit<Todo, 'id'>>(
    (newTodo) => api.post<Todo, Omit<Todo, 'id'>>('/todos', newTodo),
    { invalidateQueries: ['todos'] }
  )
}

export const useUpdateTodo = () => {
  const api = createApiClient()
  return useApiMutation<Todo, Todo>(
    (updatedTodo) => api.put<Todo, Todo>(`/todos/${updatedTodo.id}`, updatedTodo),
    { invalidateQueries: ['todos'] }
  )
}

export const useDeleteTodo = () => {
  const api = createApiClient()
  return useApiMutation<void, string>(
    (todoId) => api.delete(`/todos/${todoId}`),
    { invalidateQueries: ['todos'] }
  )
}

export const useLogin = () => {
  const api = createApiClient()
  return useApiMutation<LoginResponse, { email: string; password: string }>(
    (credentials) => api.post<LoginResponse, { email: string; password: string }>('/auth/login', credentials)
  )
}

export const useRegister = () => {
  const api = createApiClient()
  return useApiMutation<void, { email: string; password: string }>(
    (credentials) => api.post<void, { email: string; password: string }>('/auth/register', credentials)
  )
}