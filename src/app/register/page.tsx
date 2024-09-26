'use client'

import { Box, Container, VStack } from '@chakra-ui/react'
import { RegisterForm } from '@/components/RegisterForm'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RegisterPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <Box as="main" minHeight="100vh" className="bg-gradient-to-r from-purple-200 via-pink-300 to-red-200">
      <Container maxW="container.md" py={20}>
        <VStack spacing={6} align="center" justify="center">
          <RegisterForm />
        </VStack>
      </Container>
    </Box>
  )
}