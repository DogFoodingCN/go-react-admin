import { useState } from 'react'
import { LockOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons'
import { App, Button, Card, Checkbox, Form, Input, Space, Typography } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage, login } from '@/shared/setup/api'
import { useAuthStore } from '@/shared/auth/auth-store'
import { useTenantStore } from '@/shared/tenant/tenant-store'
import { rem } from '@/shared/style/rem'
import { AuthBrandLayout } from '@/shared/ui/AuthBrandLayout'

type LoginFormValues = {
  username: string
  password: string
  captcha?: string
  remember?: boolean
}

const allowDevFallback = import.meta.env.DEV && import.meta.env.VITE_ALLOW_DEV_LOGIN === 'true'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { message } = App.useApp()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setTenant = useTenantStore((s) => s.setTenant)
  const usernameFromQuery = searchParams.get('username') || undefined

  const [form] = Form.useForm<LoginFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [failCount, setFailCount] = useState(0)
  const locked = failCount >= 5

  const captchaCode = 'K8M3'

  async function onFinish(values: LoginFormValues) {
    if (locked) {
      message.error('尝试次数过多，请稍后再试或联系管理员')
      return
    }
    // 验证码 UI 占位：后端未接入前仅要求非空，不阻断主路径
    if (!values.captcha?.trim()) {
      setErrorText('请输入验证码')
      return
    }

    setSubmitting(true)
    setErrorText(null)
    try {
      const result = await login({
        username: values.username,
        password: values.password,
      })
      setAuth(result.token, result.user_name || values.username)
      if (result.tenant_id) {
        setTenant(result.tenant_id, result.tenant_name || result.tenant_id)
      }
      setFailCount(0)
      message.success(result.note || '登录成功')
      navigate('/platform/dashboard', { replace: true })
    } catch (err) {
      const status =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined

      if (allowDevFallback && (status === 404 || status === 501 || status === undefined)) {
        setAuth('dev-token', values.username)
        setTenant('tenant-demo', 'Demo 租户')
        message.warning(
          `开发开关已开启：登录接口不可用（${getApiErrorMessage(err, '占位')}），已本地占位登录`,
        )
        navigate('/platform/dashboard', { replace: true })
        return
      }

      const text = getApiErrorMessage(err, '用户名或密码错误')
      setErrorText(text)
      setFailCount((c) => c + 1)
      message.error(text)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthBrandLayout>
      <Card
        bordered={false}
        style={{
          borderRadius: rem(12),
          boxShadow: `0 ${rem(8)} ${rem(24)} rgba(15, 35, 80, 0.08)`,
        }}
        styles={{ body: { padding: rem(36) } }}
      >
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: rem(8) }}>
          {locked ? '登录已锁定' : '欢迎登录'}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: rem(24) }}>
          {locked
            ? '连续失败次数过多，请稍后再试或联系管理员开通'
            : '使用平台超管或租户账号进入控制台'}
        </Typography.Paragraph>

        {errorText && !locked ? (
          <Typography.Paragraph type="danger" style={{ marginBottom: rem(16) }}>
            {errorText}
          </Typography.Paragraph>
        ) : null}

        {locked ? (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            <Typography.Text type="secondary">
              安全策略：短时间多次失败后暂时锁定本页登录操作。
            </Typography.Text>
            <Button
              onClick={() => {
                setFailCount(0)
                setErrorText(null)
              }}
            >
              我知道了，重试
            </Button>
          </Space>
        ) : (
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            initialValues={{
              username: usernameFromQuery || '',
              remember: true,
            }}
            onFinish={(values) => void onFinish(values)}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  size="large"
                  prefix={<SafetyOutlined />}
                  placeholder="请输入验证码"
                  style={{ flex: 1 }}
                />
                <Button
                  size="large"
                  style={{
                    width: rem(120),
                    fontWeight: 700,
                    letterSpacing: rem(2),
                    background: '#e6f4ff',
                    borderColor: '#91caff',
                    color: '#0958d9',
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    message.info(`演示验证码：${captchaCode}`)
                  }}
                >
                  {captchaCode}
                </Button>
              </Space.Compact>
            </Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: rem(20),
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Typography.Link type="secondary" style={{ fontSize: rem(13) }}>
                忘记密码？ 联系管理员
              </Typography.Link>
            </div>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              登录
            </Button>
            <Typography.Paragraph
              type="secondary"
              style={{
                textAlign: 'center',
                marginTop: rem(20),
                marginBottom: 0,
                fontSize: rem(13),
              }}
            >
              安全 · 可审计 · 可扩展
            </Typography.Paragraph>
          </Form>
        )}
      </Card>
    </AuthBrandLayout>
  )
}
