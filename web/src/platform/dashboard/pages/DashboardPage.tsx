import {
  AppstoreOutlined,
  AuditOutlined,
  ClusterOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Card, Col, Row, Space, Statistic, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { rem } from '@/shared/style/rem'
import { PageContainer } from '@/shared/ui/PageContainer'
import { useTenantStore } from '@/shared/tenant/tenant-store'

const quickLinks = [
  { title: '租户管理', path: '/platform/tenants', icon: <ClusterOutlined /> },
  { title: '应用开通', path: '/platform/apps', icon: <AppstoreOutlined /> },
  { title: '用户角色', path: '/platform/iam', icon: <TeamOutlined /> },
  { title: '审计日志', path: '/platform/audit', icon: <AuditOutlined /> },
]

export function DashboardPage() {
  const tenantName = useTenantStore((s) => s.tenantName)
  const navigate = useNavigate()

  return (
    <PageContainer
      title="工作台"
      description={`当前租户：${tenantName || '未选择'}。平台能力与业务应用从这里进入。`}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="租户" value={1} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="已开通应用" value={1} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="权限模型" value="RBAC" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: rem(16) }}>
        <Col xs={24} lg={16}>
          <Card title="快捷入口">
            <Row gutter={[12, 12]}>
              {quickLinks.map((item) => (
                <Col xs={12} sm={6} key={item.path}>
                  <Card
                    hoverable
                    size="small"
                    onClick={() => navigate(item.path)}
                    styles={{ body: { textAlign: 'center', padding: rem(16) } }}
                  >
                    <Space direction="vertical" size={4}>
                      <span style={{ fontSize: rem(22), color: '#1677ff' }}>
                        {item.icon}
                      </span>
                      <Typography.Text>{item.title}</Typography.Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="当前上下文">
            <Typography.Paragraph style={{ marginBottom: rem(8) }}>
              租户：{tenantName || '未选择'}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Card + Statistic · 对接 API 后展示实时指标。
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  )
}
