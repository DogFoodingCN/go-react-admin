import { Alert } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'

export function IamPage() {
  return (
    <PageContainer title="用户角色" description="IAM / RBAC 占位页。">
      <Alert
        type="info"
        showIcon
        message="待对接 server/internal/platform/iam"
        description="用户、角色、权限码与菜单将由此管理；权限守卫见 shared/access。"
      />
    </PageContainer>
  )
}
