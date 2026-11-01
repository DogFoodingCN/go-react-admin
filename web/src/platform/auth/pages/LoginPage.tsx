import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { App, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/shared/auth/auth-store'
import { useTenantStore } from '@/shared/tenant/tenant-store'

export function LoginPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setTenant = useTenantStore((s) => s.setTenant)

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(160deg, #f0f5ff 0%, #f5f5f5 45%, #e6f4ff 100%)',
      }}
    >
      <LoginForm
        title="go-react-admin"
        subTitle="多租户 · 多应用管理后台"
        onFinish={async (values) => {
          // Bootstrap mock login until server auth is ready
          setAuth('dev-token', values.username)
          setTenant('tenant-demo', 'Demo 租户')
          message.success('登录成功（本地占位）')
          navigate('/platform/dashboard', { replace: true })
          return true
        }}
      >
        <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
          后端未就绪时使用本地占位登录，任意账号即可进入。
        </Typography.Paragraph>
        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="用户名"
          initialValue="admin"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="密码"
          initialValue="admin"
          rules={[{ required: true, message: '请输入密码' }]}
        />
      </LoginForm>
    </div>
  )
}
