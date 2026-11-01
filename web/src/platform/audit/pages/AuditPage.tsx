import { Alert } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'

export function AuditPage() {
  return (
    <PageContainer title="审计日志" description="操作审计占位页。">
      <Alert
        type="info"
        showIcon
        message="待对接 server/internal/platform/audit"
        description="平台级与高危操作审计将在此展示。"
      />
    </PageContainer>
  )
}
