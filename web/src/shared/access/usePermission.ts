import { useAuthStore } from '@/shared/auth/auth-store'

/**
 * Placeholder permission hook. Replace with backend permission codes later.
 * For bootstrap: any authenticated user is treated as allowed.
 */
export function usePermission(code: string): boolean {
  const token = useAuthStore((s) => s.token)
  void code
  return Boolean(token)
}

export function useHasAnyPermission(codes: string[]): boolean {
  const token = useAuthStore((s) => s.token)
  void codes
  return Boolean(token)
}
