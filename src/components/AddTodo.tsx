'use client'

import { IconButton } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'

interface AddTodoProps {
  onAddTodo: () => void
}

export function AddTodo({ onAddTodo }: AddTodoProps) {
  const handleAddTodo = () => {
    onAddTodo()
  }

  return (
    <IconButton
      onClick={handleAddTodo}
      aria-label="Add Todo"
      icon={<AddIcon />}
      size="lg"
      variant="solid"
      className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center"
    />
  )
}