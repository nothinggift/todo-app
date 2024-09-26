import { Todo, LoginResponse, QueryOptions } from '@/types'
import { createApiClient, useApiQuery, useApiMutation } from '@/utils/api'

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