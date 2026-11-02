import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useSetupStore } from './setup-store'

type SetupGateProps = {
  children: ReactNode
}

export function SetupGate({ children }: SetupGateProps) {
  const location = useLocation()
  const status = useSetupStore((s) => s.status)
  const loading = useSetupStore((s) => s.loading)
  const fetchStatus = useSetupStore((s) => s.fetchStatus)

  useEffect(() => {
    void fetchStatus()
  }, [fetchStatus])

  if (loading || !status) {
    return (
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" tip="检查系统状态…" />
      </div>
    )
  }

  const onSetup = location.pathname.startsWith('/setup')
  const state = status.state

  // need_setup / db_unreachable → force /setup, block business shell & login
  if (state === 'need_setup' || state === 'db_unreachable') {
    if (!onSetup) {
      return <Navigate to="/setup" replace />
    }
    return children
  }

  // ready → allow /login + auth routes; visiting /setup redirects to login
  if (onSetup) {
    return <Navigate to="/login" replace />
  }

  return children
}
