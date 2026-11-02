import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BasicLayout } from '@/app/layouts/BasicLayout'
import { RequireAuth } from '@/shared/auth/RequireAuth'
import { SetupGate } from '@/shared/setup/SetupGate'
import { LoginPage } from '@/platform/auth/pages/LoginPage'
import { SetupPage } from '@/platform/setup/pages/SetupPage'
import { DashboardPage } from '@/platform/dashboard/pages/DashboardPage'
import { TenantListPage } from '@/platform/tenant/pages/TenantListPage'
import { AppListPage } from '@/platform/app/pages/AppListPage'
import { IamPage } from '@/platform/iam/pages/IamPage'
import { AuditPage } from '@/platform/audit/pages/AuditPage'
import { DemoListPage } from '@/apps/demo/pages/DemoListPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <SetupGate>
        <Routes>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <BasicLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/platform/dashboard" replace />} />
            <Route path="platform/dashboard" element={<DashboardPage />} />
            <Route path="platform/tenants" element={<TenantListPage />} />
            <Route path="platform/apps" element={<AppListPage />} />
            <Route path="platform/iam" element={<IamPage />} />
            <Route path="platform/audit" element={<AuditPage />} />
            <Route path="apps/demo/list" element={<DemoListPage />} />
            <Route
              path="apps/demo"
              element={<Navigate to="/apps/demo/list" replace />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SetupGate>
    </BrowserRouter>
  )
}
