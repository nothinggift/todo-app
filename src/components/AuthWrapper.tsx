'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PUBLIC_ROUTES } from '@/utils/constants';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== null && !isLoggedIn() && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [isLoggedIn, pathname, router]);

  return <>{children}</>;
}