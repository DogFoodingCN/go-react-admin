import { create } from 'zustand'
import { fetchSetupStatus } from './api'
import { defaultAdminForm, defaultDsnForm } from './dsn'
import type { AdminFormValues, DsnFormValues, SetupStatus } from './types'

type SetupStore = {
  status: SetupStatus | null
  loading: boolean
  error: string | null
  /** In-memory wizard draft only — never persisted. */
  dsnDraft: DsnFormValues
  adminDraft: AdminFormValues
  setDsnDraft: (values: Partial<DsnFormValues>) => void
  setAdminDraft: (values: Partial<AdminFormValues>) => void
  clearDraft: () => void
  fetchStatus: () => Promise<void>
  setStatus: (status: SetupStatus) => void
}

export const useSetupStore = create<SetupStore>((set) => ({
  status: null,
  loading: true,
  error: null,
  dsnDraft: { ...defaultDsnForm },
  adminDraft: { ...defaultAdminForm },
  setDsnDraft: (values) =>
    set((s) => ({ dsnDraft: { ...s.dsnDraft, ...values } })),
  setAdminDraft: (values) =>
    set((s) => ({ adminDraft: { ...s.adminDraft, ...values } })),
  clearDraft: () =>
    set({
      dsnDraft: { ...defaultDsnForm },
      adminDraft: { ...defaultAdminForm },
    }),
  setStatus: (status) => set({ status }),
  fetchStatus: async () => {
    set({ loading: true, error: null })
    try {
      const status = await fetchSetupStatus()
      set({ status, loading: false, error: null })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '无法获取系统初始化状态'
      set({
        loading: false,
        error: message,
        // Soft fallback: allow Setup UI while API is unavailable / being built
        status: {
          state: 'need_setup',
          initialized: false,
          message,
        },
      })
    }
  },
}))
