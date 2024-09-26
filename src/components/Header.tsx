'use client'

import React from 'react';
import { Box } from '@chakra-ui/react';
import UserMenu from './UserMenu';

export function Header() {
  return (
    <Box as="header" className="absolute top-5 right-5">
      <UserMenu />
    </Box>
  );
}

export default Header;