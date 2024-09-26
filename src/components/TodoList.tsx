'use client'

import { useState, useEffect } from 'react'
import { VStack, useToast, Box } from '@chakra-ui/react'
import { useTodos, usePostTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import { ClientTodo, ApiError } from '@/types'
import { TodoItem } from './TodoItem'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface TodoListProps {
  completed: boolean | null
  renderAddTodo: (onAddTodo: () => void) => React.ReactNode
}

export function TodoList({ completed, renderAddTodo }: TodoListProps) {
  const { data: apiTodos, isError, error, refetch } = useTodos({
    enabled: !!useAuthStore.getState().token,
    params: {
      completed: completed === null ? undefined : completed.toString()
    }
  })
  const [todos, setTodos] = useState<ClientTodo[]>([])
  const toast = useToast()
  const router = useRouter()

  const postTodoMutation = usePostTodo()
  const updateTodoMutation = useUpdateTodo()
  const deleteTodoMutation = useDeleteTodo()

  useEffect(() => {
    if (apiTodos) {
      setTodos(apiTodos)
    }
  }, [apiTodos])

  useEffect(() => {
    if (isError && error instanceof ApiError) {
      toast({
        title: "An error occurred",
        description: error.message || "Unable to fetch todos",
        status: "error",
      })
    }
  }, [isError, error, toast])

  useEffect(() => {
    refetch()
  }, [completed, refetch])

  const handleAddTodo = () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      router.push('/login')
      return
    }
    const newTodo: ClientTodo = {
      id: new Date().getTime(),
      content: '',
      completed: false,
      isNew: true,
    }
    setTodos(prevTodos => [newTodo, ...prevTodos])
  }

  const handleUpdateTodo = (updatedTodo: ClientTodo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo))
    )

    if (updatedTodo.isNew) {
      if (updatedTodo.content.trim() !== '') {
        postTodoMutation.mutate(
          { content: updatedTodo.content, completed: updatedTodo.completed },
          {
            onSuccess: (newTodo) => {
              setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === updatedTodo.id ? newTodo : todo))
              )
            },
            onError: (error: ApiError) => {
              toast({
                title: "Failed to add todo",
                description: error.message,
                status: "error",
              })
            },
          }
        )
      } else {
        handleDeleteTodo(updatedTodo)
      }
    } else {
      updateTodoMutation.mutate(updatedTodo, {
        onError: (error: ApiError) => {
          toast({
            title: "Failed to update todo",
            description: error.message,
            status: "error",
          })
        },
      })
    }
  }

  const handleDeleteTodo = (deletedTodo: ClientTodo) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodo.id))

    if (!deletedTodo.isNew) {
      deleteTodoMutation.mutate(deletedTodo.id.toString(), {
        onError: (error: ApiError) => {
          toast({
            title: "Failed to delete todo",
            description: error.message,
            status: "error",
          })
        },
      })
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      {renderAddTodo(handleAddTodo)}
      <Box className='max-h-[55vh] overflow-y-auto'>
        {todos.length === 0 ? (
          <Box height="100px" display="flex" alignItems="center" justifyContent="center">
            <span className="text-gray-500">No tasks available</span>
          </Box>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              isNew={todo.isNew}
            />
          ))
        )}
      </Box>
    </VStack>
  )
}