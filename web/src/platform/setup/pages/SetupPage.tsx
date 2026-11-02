import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Input,
  Result,
  Select,
  Space,
  Steps,
  Switch,
  Typography,
} from 'antd'
import {
  getApiErrorMessage,
  initializeSetup,
  testConnection,
} from '@/shared/setup/api'
import { buildLibpqDsn } from '@/shared/setup/dsn'
import { useSetupStore } from '@/shared/setup/setup-store'
import type { AdminFormValues, DsnFormValues } from '@/shared/setup/types'
import {
  BRAND_LOGO_SRC,
  SetupWizardShell,
} from '@/shared/ui/AuthBrandLayout'

const stepItems = [
  {
    title: '配置数据库连接（DSN）',
    description: '填写并测试数据库连接',
  },
  {
    title: '设置平台超管账号',
    description: '创建平台超级管理员',
  },
  {
    title: '完成',
    description: '初始化完成，进入登录',
  },
]

const entrySteps = [
  {
    title: '配置数据库连接（DSN）',
    desc: '填写主机、端口、库名并可选测连',
  },
  {
    title: '设置平台超管账号',
    desc: '创建首次登录使用的超级管理员',
  },
  {
    title: '完成并进入登录',
    desc: '初始化成功后使用超管账号登录',
  },
]

type Phase = 'entry' | 'wizard'

export function SetupPage() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const status = useSetupStore((s) => s.status)
  const dsnDraft = useSetupStore((s) => s.dsnDraft)
  const adminDraft = useSetupStore((s) => s.adminDraft)
  const setDsnDraft = useSetupStore((s) => s.setDsnDraft)
  const setAdminDraft = useSetupStore((s) => s.setAdminDraft)
  const clearDraft = useSetupStore((s) => s.clearDraft)
  const fetchStatus = useSetupStore((s) => s.fetchStatus)
  const setStatus = useSetupStore((s) => s.setStatus)

  const unreachable = status?.state === 'db_unreachable'
  const [phase, setPhase] = useState<Phase>(unreachable ? 'wizard' : 'entry')
  const [current, setCurrent] = useState(0)
  const [dsnForm] = Form.useForm<DsnFormValues>()
  const [adminForm] = Form.useForm<AdminFormValues>()
  const [testing, setTesting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [testHint, setTestHint] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [done, setDone] = useState(false)
  const [doneUsername, setDoneUsername] = useState('')

  const useAdvanced = Form.useWatch('useAdvanced', dsnForm) ?? dsnDraft.useAdvanced

  const previewDsn = useMemo(() => {
    try {
      const dsn = buildLibpqDsn(dsnDraft)
      return dsn.replace(/password=(?:'[^']*'|[^\s]+)/i, 'password=***')
    } catch {
      return ''
    }
  }, [dsnDraft])

  const stepCaption =
    current === 0
      ? '步骤 1/3 · 配置数据库连接（DSN）'
      : '步骤 2/3 · 设置平台超管账号'

  async function handleTestConnection() {
    try {
      const values = await dsnForm.validateFields()
      setDsnDraft(values)
      const dsn = buildLibpqDsn(values)
      setTesting(true)
      setTestHint(null)
      const result = await testConnection({ dsn })
      if (result.ok !== false) {
        setTestHint({ type: 'success', text: result.message || '连接成功' })
        message.success(result.message || '连接成功')
      } else {
        setTestHint({ type: 'error', text: result.message || '连接失败' })
        message.error(result.message || '连接失败')
      }
    } catch (err) {
      const text = getApiErrorMessage(err, '测连失败，请检查 DSN 或服务端')
      setTestHint({ type: 'error', text })
      message.error(text)
    } finally {
      setTesting(false)
    }
  }

  async function goNextFromDsn() {
    const values = await dsnForm.validateFields()
    setDsnDraft(values)
    setTestHint(null)
    setCurrent(1)
  }

  async function handleInitialize() {
    const values = await adminForm.validateFields()
    setAdminDraft(values)
    const dsn = buildLibpqDsn(dsnDraft)

    setSubmitting(true)
    try {
      await initializeSetup({
        dsn,
        admin_username: values.admin_username,
        admin_password: values.admin_password,
        admin_display_name: values.admin_display_name || undefined,
        bootstrap_tenant_name: values.bootstrap_tenant_name || undefined,
      })
      setDoneUsername(values.admin_username)
      clearDraft()
      setStatus({
        state: 'ready',
        initialized: true,
        dsn_persisted: true,
        db_reachable: true,
        has_admin: true,
        migrations_pending: false,
      })
      setDone(true)
      message.success('初始化成功')
      void fetchStatus()
    } catch (err) {
      message.error(getApiErrorMessage(err, '初始化失败，请检查参数后重试'))
    } finally {
      setSubmitting(false)
    }
  }

  function goLogin() {
    const q = doneUsername
      ? `?username=${encodeURIComponent(doneUsername)}`
      : ''
    navigate(`/login${q}`, { replace: true })
  }

  if (phase === 'entry' && !unreachable && !done) {
    return (
      <div className="setup-entry">
        <img
          aria-hidden
          className="setup-entry__background"
          src="/brand/setup-entry/background.svg"
        />
        <img
          aria-hidden
          className="setup-entry__geometry"
          src="/brand/setup-entry/decorative-geometry.svg"
        />

        <div className="setup-entry__lockup">
          <img src={BRAND_LOGO_SRC} alt="" width={60} height={50} />
          <span>Go-React-Admin</span>
        </div>

        <section className="setup-entry__brand-copy">
          <img
            aria-hidden
            className="setup-entry__accent"
            src="/brand/setup-entry/accent-line.svg"
          />
          <h1>
            多租户 · 多应用
            <br />
            管理控制台
          </h1>
          <p>
            统一初始化、租户治理与应用开通，
            <br />
            让平台交付更清晰、更可控。
          </p>
        </section>

        <section className="setup-entry__features">
          <div className="setup-entry__feature">
            <span className="setup-entry__feature-icon setup-entry__feature-icon--secure">
              <img src="/brand/setup-entry/icon-secure.svg" alt="" />
              <img src="/brand/setup-entry/icon-secure-check.svg" alt="" />
            </span>
            <span>安全可靠</span>
          </div>
          <img className="setup-entry__feature-divider" src="/brand/setup-entry/divider.svg" alt="" />
          <div className="setup-entry__feature">
            <span className="setup-entry__feature-icon setup-entry__feature-icon--audit">
              <img src="/brand/setup-entry/icon-audit.svg" alt="" />
              <img src="/brand/setup-entry/icon-audit-inner.svg" alt="" />
            </span>
            <span>可审计</span>
          </div>
          <img className="setup-entry__feature-divider" src="/brand/setup-entry/divider.svg" alt="" />
          <div className="setup-entry__feature">
            <span className="setup-entry__feature-icon setup-entry__feature-icon--extensible">
              <img src="/brand/setup-entry/icon-extensible.svg" alt="" />
              <img src="/brand/setup-entry/icon-extensible-inner.svg" alt="" />
            </span>
            <span>可扩展</span>
          </div>
          <small>Powered by <a href='https://dogfooding.cn' target='_blank'>dogfooding.cn</a></small>
        </section>

        <main className="setup-entry__card">
          <header className="setup-entry__heading">
            <h2>系统尚未初始化</h2>
            <p>完成安装向导后，即可使用超管账号登录</p>
          </header>

          <div className="setup-entry__steps">
            {entrySteps.map((item, index) => (
              <div className="setup-entry__step" key={item.title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.desc}</small>
                </div>
              </div>
            ))}
          </div>

          <button
            className="setup-entry__button"
            type="button"
            onClick={() => {
              setPhase('wizard')
              setCurrent(0)
            }}
          >
            开始初始化
          </button>

          <footer className="setup-entry__card-footer">
            <img
              aria-hidden
              className="setup-entry__footer-line"
              src="/brand/setup-entry/footer-line.svg"
            />
            <span>
              <img src="/brand/setup-entry/footer-shield.svg" alt="" />
              约 2～3 分钟 · 可随时返回本页
            </span>
          </footer>
        </main>
      </div>
    )
  }

  if (done) {
    return (
      <SetupWizardShell>
        <SetupCard>
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
            系统初始化
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 20 }}>
            步骤 3/3 · 完成
          </Typography.Paragraph>
          <Steps
            current={3}
            items={stepItems}
            style={{ marginBottom: 28 }}
          />
          <Result
            status="success"
            title="初始化完成"
            subTitle="系统已就绪，请使用刚设置的超管账号登录"
            extra={
              <Button type="primary" size="large" onClick={goLogin}>
                去登录
              </Button>
            }
          />
        </SetupCard>
      </SetupWizardShell>
    )
  }

  return (
    <SetupWizardShell>
      <SetupCard>
        <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
          {unreachable ? '系统初始化' : '系统初始化'}
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 20 }}>
          {unreachable
            ? '步骤 1/3 · 配置数据库连接（DSN）'
            : stepCaption}
        </Typography.Paragraph>

        {unreachable ? (
          <>
            <Steps current={0} items={stepItems} style={{ marginBottom: 24 }} />
            <Alert
              type="error"
              showIcon
              message="连接失败，请检查数据库配置后重试。"
              description={
                status?.message ||
                '系统已初始化，但数据库当前不可达。请检查 PostgreSQL 后重试，勿重复执行初始化。'
              }
              style={{ marginBottom: 20 }}
            />
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              数据库连接串（DSN）
            </Typography.Text>
            <Input.TextArea
              rows={2}
              disabled
              placeholder="已持久化（脱敏，不回传完整 DSN）"
              style={{ marginBottom: 16 }}
            />
            <Space>
              <Button onClick={() => void fetchStatus()}>返回修改</Button>
              <Button type="primary" onClick={() => void fetchStatus()}>
                重试
              </Button>
            </Space>
          </>
        ) : (
          <>
            <Steps
              current={current}
              items={stepItems}
              style={{ marginBottom: 24 }}
            />

            {current === 0 ? (
              <Form
                form={dsnForm}
                layout="vertical"
                initialValues={dsnDraft}
                requiredMark="optional"
                onValuesChange={(_, all) => setDsnDraft(all)}
              >
                <Form.Item
                  label="高级：粘贴完整 DSN"
                  name="useAdvanced"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="开" unCheckedChildren="关" />
                </Form.Item>

                {useAdvanced ? (
                  <Form.Item
                    label="数据库连接串（DSN）"
                    name="advancedDsn"
                    rules={[{ required: true, message: '请粘贴完整 DSN' }]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="postgres://user:pass@127.0.0.1:5432/go_react_admin?sslmode=disable"
                    />
                  </Form.Item>
                ) : (
                  <>
                    <Form.Item
                      label="主机 Host"
                      name="host"
                      rules={[{ required: true, message: '请输入主机' }]}
                    >
                      <Input placeholder="127.0.0.1" />
                    </Form.Item>
                    <Space style={{ display: 'flex' }} size={16}>
                      <Form.Item
                        label="端口"
                        name="port"
                        rules={[{ required: true, message: '请输入端口' }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="5432" />
                      </Form.Item>
                      <Form.Item
                        label="数据库名"
                        name="database"
                        rules={[{ required: true, message: '请输入数据库名' }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="go_react_admin" />
                      </Form.Item>
                    </Space>
                    <Form.Item
                      label="用户名"
                      name="user"
                      rules={[{ required: true, message: '请输入用户名' }]}
                    >
                      <Input placeholder="postgres" />
                    </Form.Item>
                    <Form.Item
                      label="密码"
                      name="password"
                      rules={[{ required: true, message: '请输入密码' }]}
                    >
                      <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item label="SSL Mode" name="sslmode">
                      <Select
                        options={[
                          { value: 'disable', label: 'disable' },
                          { value: 'require', label: 'require' },
                          { value: 'prefer', label: 'prefer' },
                          { value: 'verify-full', label: 'verify-full' },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item label="TimeZone" name="timezone">
                      <Input placeholder="Asia/Shanghai" />
                    </Form.Item>
                  </>
                )}

                {testHint ? (
                  <Alert
                    type={testHint.type}
                    showIcon
                    message={testHint.text}
                    style={{ marginBottom: 16 }}
                  />
                ) : null}

                <Space>
                  <Button onClick={() => setPhase('entry')}>返回</Button>
                  <Button onClick={() => void handleTestConnection()} loading={testing}>
                    测试连接
                  </Button>
                  <Button type="primary" onClick={() => void goNextFromDsn()}>
                    下一步
                  </Button>
                </Space>
              </Form>
            ) : null}

            {current === 1 ? (
              <Form
                form={adminForm}
                layout="vertical"
                initialValues={adminDraft}
                requiredMark="optional"
                onValuesChange={(_, all) => setAdminDraft(all)}
              >
                {previewDsn ? (
                  <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="将使用以下 DSN（脱敏）完成初始化"
                    description={<Typography.Text code>{previewDsn}</Typography.Text>}
                  />
                ) : null}
                <Form.Item
                  label="超管用户名"
                  name="admin_username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input placeholder="admin" autoComplete="username" />
                </Form.Item>
                <Form.Item
                  label="密码（至少 6 位）"
                  name="admin_password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少 6 位' },
                  ]}
                >
                  <Input.Password placeholder="至少 6 位密码" autoComplete="new-password" />
                </Form.Item>
                <Form.Item
                  label="确认密码"
                  name="admin_password_confirm"
                  dependencies={['admin_password']}
                  rules={[
                    { required: true, message: '请再次输入密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('admin_password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次密码不一致'))
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="再次输入密码" autoComplete="new-password" />
                </Form.Item>
                <Form.Item label="显示名（可选）" name="admin_display_name">
                  <Input placeholder="平台管理员" />
                </Form.Item>
                <Form.Item label="默认租户名（可选）" name="bootstrap_tenant_name">
                  <Input placeholder="default" />
                </Form.Item>
                <Space>
                  <Button onClick={() => setCurrent(0)}>上一步</Button>
                  <Button
                    type="primary"
                    loading={submitting}
                    onClick={() => void handleInitialize()}
                  >
                    完成初始化
                  </Button>
                </Space>
              </Form>
            ) : null}
          </>
        )}
      </SetupCard>
    </SetupWizardShell>
  )
}

function SetupCard({ children }: { children: ReactNode }) {
  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(15, 35, 80, 0.08)',
      }}
      styles={{ body: { padding: '40px 48px' } }}
    >
      {children}
    </Card>
  )
}
