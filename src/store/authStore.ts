import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  isAutoLogin: boolean;
  setAutoLogin: (isAutoLogin: boolean) => void;
  logout: (callback?: () => void) => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token: string | null) => set({ token }),
      setUser: (user: User | null) => set({ user }),
      isAutoLogin: false,
      setAutoLogin: (isAutoLogin: boolean) => set({ isAutoLogin }),
      logout: (callback?: () => void) => {
        set({ token: null, user: null, isAutoLogin: false });
        if (callback) {
          callback();
        }
      },
      isLoggedIn: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
)