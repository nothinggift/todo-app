'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, IconButton, Input } from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { ClientTodo } from '../utils/api'

interface TodoItemProps {
  todo: ClientTodo
  onUpdate: (updatedTodo: ClientTodo) => void
  onDelete: (deletedTodo: ClientTodo) => void
  isNew?: boolean
}

export function TodoItem({ todo, onUpdate, onDelete, isNew }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(isNew)
  const [editedContent, setEditedContent] = useState(todo.content)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if ((isEditing || isNew) && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing, isNew])

  const handleToggle = () => {
    onUpdate({ ...todo, completed: !todo.completed })
  }

  const handleDelete = () => {
    onDelete(todo)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedContent.trim() === '') {
      onDelete(todo)
    } else {
      onUpdate({ ...todo, content: editedContent.trim() })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <Box className="flex items-center p-4 hover:bg-gray-100">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="mr-2 form-checkbox h-5 w-5 text-purple-600"
      />
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-grow mr-2"
        />
      ) : (
        <span
          onClick={handleEdit}
          className={`flex-grow cursor-pointer break-words overflow-hidden ${
            todo.completed ? 'line-through text-gray-500' : ''
          }`}
        >
          {todo.content}
        </span>
      )}
      <IconButton
        aria-label="Delete todo"
        icon={<DeleteIcon />}
        onClick={handleDelete}
        size="sm"
        color="gray.500"
        variant="ghost"
      />
    </Box>
  )
}