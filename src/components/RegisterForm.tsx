'use client'

import React from 'react';
import { useFormik } from 'formik';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Box,
  Heading,
  Text,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useAuthStore } from '../store/authStore';
import { useRegister, useLogin, ApiError } from '../utils/api';

export function RegisterForm() {
  const { setToken, setUser } = useAuthStore();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const toast = useToast();

  const validate = (values: { email: string; password: string }) => {
    const errors: { email?: string; password?: string } = {};
    if (!values.email) {
      errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        await registerMutation.mutateAsync(values);
        const loginResponse = await loginMutation.mutateAsync(values);
        setToken(loginResponse.access_token);
        setUser({ email: values.email });
        toast({
          title: 'Registration successful',
          status: 'success',
        });
        // Redirect to main page or dashboard here
      } catch (error) {
        console.error('Registration failed:', error);
        toast({
          title: 'Registration failed',
          description: error instanceof ApiError ? error.message : 'Unknown error',
          status: 'error',
        });
      }
    },
  });

  return (
    <Box className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <Heading size="lg" className="text-center mb-6">Sign up</Heading>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired isInvalid={formik.touched.email && !!formik.errors.email}>
            <FormLabel htmlFor="email" className="text-gray-600">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={formik.touched.password && !!formik.errors.password}>
            <FormLabel htmlFor="password" className="text-gray-600">Password</FormLabel>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={registerMutation.isPending || loginMutation.isPending}
            className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign up
          </Button>
        </VStack>
      </form>
      <Text className="text-center mt-4">
        <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
      </Text>
    </Box>
  );
}

export default RegisterForm;