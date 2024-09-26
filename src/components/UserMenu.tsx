'use client'

import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Text } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout(() => {
        router.push('/login');
    });
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        className="bg-transparent text-black hover:bg-gray-100"
      >
        <Text as="span" maxWidth="200px" isTruncated>
          { user ? user.email : 'Guest' }
        </Text>
      </MenuButton>
      <MenuList>
        { user ? (
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        ) : (
          <MenuItem as='a' href="/login">Login</MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default UserMenu;