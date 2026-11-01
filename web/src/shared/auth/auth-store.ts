import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  token: string | null
  userName: string | null
  setAuth: (token: string, userName: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setAuth: (token, userName) => set({ token, userName }),
      clearAuth: () => set({ token: null, userName: null }),
    }),
    { name: 'gra-auth' },
  ),
)
