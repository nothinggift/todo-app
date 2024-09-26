'use client'

import { Box, Container } from '@chakra-ui/react'
import { TodoListCard } from '../components/TodoListCard'

export default function Home() {

  return (
    <Box as="main" minHeight="100vh" className="bg-gradient-to-r from-purple-200 via-pink-300 to-red-200">
      <Container maxW="container.xl" py={20} centerContent>
        <TodoListCard />
      </Container>
    </Box>
  )
}
