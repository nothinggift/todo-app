'use client'

import { Box, VStack, Divider } from '@chakra-ui/react'
import { TodoList } from './TodoList'
import { AddTodo } from './AddTodo'
import { useFilteredTodos } from '@/hooks/useFilteredTodos'

export function TodoListCard() {
    const { filterStatus, completed, handleStatusChange } = useFilteredTodos();
  
    return (
      <Box className="w-full mt-10 md:max-w-4xl xl:max-w-7xl">
        <VStack
          spacing={4}
          align="stretch"
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <Box className="p-4 pb-0 text-3xl font-semibold text-blue-600">
            TODO
          </Box>
          <Box className="pl-4">
            <select 
              className="rounded-md text-gray-500"
              value={filterStatus}
              onChange={(e) => handleStatusChange(e.target.value as 'all' | 'completed' | 'pending')}
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </Box>
          <TodoList
            completed={completed}
            renderAddTodo={(onAddTodo) => (
              <Box className="relative mb-4">
                <Divider />
                <Box className="absolute right-5 -top-6">
                  <AddTodo onAddTodo={onAddTodo} />
                </Box>
              </Box>
            )}
          />
        </VStack>
      </Box>
    )
  }
