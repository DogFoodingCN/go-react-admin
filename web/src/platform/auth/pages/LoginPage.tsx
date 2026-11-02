import { useState } from 'react'
import { App, Checkbox, Form, Input, Typography } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage, login } from '@/shared/setup/api'
import { useAuthStore } from '@/shared/auth/auth-store'
import { useTenantStore } from '@/shared/tenant/tenant-store'
import { AuthEntryCard, AuthEntryShell } from '@/shared/ui/AuthBrandLayout'

type LoginFormValues = {
  username: string
  password: string
  captcha?: string
  remember?: boolean
}

const allowDevFallback = import.meta.env.DEV && import.meta.env.VITE_ALLOW_DEV_LOGIN === 'true'
const captchaCode = 'K8M3'

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

  async function onFinish(values: LoginFormValues) {
    if (locked) {
      message.error('尝试次数过多，请稍后再试或联系管理员')
      return
    }
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
    <AuthEntryShell>
      <AuthEntryCard className="auth-login-card">
        <header className="setup-entry__heading">
          <h2>{locked ? '登录已锁定' : '欢迎登录'}</h2>
          <p>
            {locked
              ? '连续失败次数过多，请稍后再试或联系管理员'
              : '使用平台超管或租户账号进入控制台'}
          </p>
        </header>

        {locked ? (
          <div className="auth-login-locked">
            <p>安全策略：短时间多次失败后暂时锁定本页登录操作。</p>
            <button
              className="setup-entry__button"
              type="button"
              onClick={() => {
                setFailCount(0)
                setErrorText(null)
              }}
            >
              我知道了，重试
            </button>
          </div>
        ) : (
          <Form
            className="auth-login-form"
            form={form}
            layout="vertical"
            requiredMark={false}
            initialValues={{
              username: usernameFromQuery || '',
              remember: true,
            }}
            onFinish={(values) => void onFinish(values)}
          >
            {errorText ? <p className="auth-login-form__error">{errorText}</p> : null}

            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                className="auth-login-form__input"
                placeholder="请输入用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                className="auth-login-form__input"
                placeholder="请输入密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <div className="auth-login-form__captcha-row">
              <Form.Item
                className="auth-login-form__captcha-field"
                name="captcha"
                label="验证码"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Input
                  className="auth-login-form__input"
                  placeholder="请输入验证码"
                />
              </Form.Item>
              <button
                className="auth-login-form__captcha-btn"
                type="button"
                onClick={() => message.info(`演示验证码：${captchaCode}`)}
              >
                {captchaCode}
              </button>
            </div>

            <div className="auth-login-form__meta">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Typography.Link type="secondary">忘记密码？联系管理员</Typography.Link>
            </div>

            <button className="setup-entry__button" type="submit" disabled={submitting}>
              {submitting ? '登录中…' : '登录'}
            </button>
          </Form>
        )}

        <footer className="setup-entry__card-footer">
          <img
            aria-hidden
            className="setup-entry__footer-line"
            src="/brand/setup-entry/footer-line.svg"
          />
          <span>
            <img src="/brand/setup-entry/footer-shield.svg" alt="" />
            仅支持账号密码登录
          </span>
        </footer>
      </AuthEntryCard>
    </AuthEntryShell>
  )
}
