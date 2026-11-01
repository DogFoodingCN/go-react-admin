import { Card, Col, Row, Statistic, Typography } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'
import { useTenantStore } from '@/shared/tenant/tenant-store'

export function DashboardPage() {
  const tenantName = useTenantStore((s) => s.tenantName)

  return (
    <PageContainer
      title="工作台"
      description={`当前租户：${tenantName || '未选择'}。平台能力与业务应用从这里进入。`}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="租户" value={1} suffix="（占位）" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="已开通应用" value={1} suffix="demo" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="权限模型" value="RBAC" />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 16 }}>
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          前端已按方案 A 初始化。下一步对接 Go API：登录、租户上下文、动态菜单与权限码。
        </Typography.Paragraph>
      </Card>
    </PageContainer>
  )
}
