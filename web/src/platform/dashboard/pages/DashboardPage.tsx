import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  CheckCircleFilled,
  DatabaseOutlined,
  PieChartFilled,
  SafetyCertificateFilled,
  TeamOutlined,
  ThunderboltFilled,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const quickLinks = [
  {
    title: '用户管理',
    description: '管理系统用户',
    path: '/platform/iam',
    icon: <TeamOutlined />,
    tone: 'blue',
  },
  {
    title: '应用管理',
    description: '管理应用资源',
    path: '/platform/apps',
    icon: <AppstoreOutlined />,
    tone: 'green',
  },
  {
    title: '权限管理',
    description: '配置权限策略',
    path: '/platform/iam',
    icon: <SafetyCertificateFilled />,
    tone: 'purple',
  },
  {
    title: '审计日志',
    description: '查看操作日志',
    path: '/platform/audit',
    icon: <AuditOutlined />,
    tone: 'orange',
  },
]

const kpis = [
  { value: '12,580', label: '总用户数', change: '↑ 12.5%', icon: <TeamOutlined />, tone: 'blue' },
  { value: '248', label: '应用数量', change: '↑ 8.3%', icon: <AppstoreOutlined />, tone: 'purple' },
  { value: '36', label: '租户数量', change: '↑ 5.1%', icon: <DatabaseOutlined />, tone: 'green' },
  {
    value: '99.9%',
    label: '系统可用性',
    change: '↑ 0.1%',
    icon: <SafetyCertificateFilled />,
    tone: 'orange',
  },
]

const activities = [
  ['2小时前', '系统管理员 更新了应用配置'],
  ['3小时前', '用户 张三 申请开通新应用'],
  ['4小时前', '租户「测试企业」创建成功'],
  ['5小时前', '用户 李四 修改了个人信息'],
]

export function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-page">
      <section className="dashboard-top-grid">
        <article className="dashboard-welcome">
          <div className="dashboard-welcome__copy">
            <p>上午好，管理员 👋</p>
            <h1>欢迎使用 go-react-admin</h1>
            <span>一个现代化、可扩展的多租户管理平台</span>
            <button type="button">
              了解更多 <span>→</span>
            </button>
          </div>
          <img src="/brand/dashboard/hero-illustration.svg" alt="" />
        </article>

        <div className="dashboard-kpis">
          {kpis.map((item) => (
            <article className={`dashboard-kpi dashboard-tone--${item.tone}`} key={item.label}>
              <span className="dashboard-kpi__icon">{item.icon}</span>
              <div>
                <strong>{item.value}</strong>
                <p>{item.label}</p>
                <small>{item.change}</small>
              </div>
              <Sparkline />
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-middle-grid">
        <article className="dashboard-panel dashboard-overview">
          <header className="dashboard-panel__header">
            <h2><BarChartOutlined /> 数据概览</h2>
            <div className="dashboard-range">
              <button className="is-active" type="button">今日</button>
              <button type="button">近7天</button>
              <button type="button">近30天</button>
              <button type="button">自定义</button>
            </div>
          </header>
          <div className="dashboard-chart__legend">
            <span><i />访问量</span>
            <span><i />注册量</span>
          </div>
          <div className="dashboard-chart">
            <div className="dashboard-chart__y">
              {['8k', '6k', '4k', '2k', '0'].map((label) => <span key={label}>{label}</span>)}
            </div>
            <div className="dashboard-chart__plot">
              <img src="/brand/dashboard/chart-grid.svg" alt="" />
              <svg viewBox="0 0 640 145" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1677ff" stopOpacity=".22" />
                    <stop offset="1" stopColor="#1677ff" stopOpacity=".02" />
                  </linearGradient>
                </defs>
                <path className="area" d="M0 61 C80 78 90 76 145 44 S260 55 330 49 S430 35 500 28 S580 43 640 39 L640 145 L0 145 Z" />
                <path className="line line--primary" d="M0 61 C80 78 90 76 145 44 S260 55 330 49 S430 35 500 28 S580 43 640 39" />
                <path className="line line--secondary" d="M0 80 C70 107 85 101 145 75 S265 67 330 75 S430 57 500 52 S585 61 640 60" />
                <line x1="500" y1="0" x2="500" y2="145" className="guide" />
                <circle cx="500" cy="28" r="4" />
              </svg>
              <span className="dashboard-chart__tip">6,320</span>
              <div className="dashboard-chart__x">
                {['04-01', '04-02', '04-03', '04-04', '04-05', '04-06', '04-07'].map((label) => <span key={label}>{label}</span>)}
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-panel dashboard-distribution">
          <header className="dashboard-panel__header">
            <h2><PieChartFilled /> 租户分布</h2>
          </header>
          <div className="dashboard-distribution__body">
            <div className="dashboard-donut">
              <i className="dashboard-donut__segment dashboard-donut__segment--top" />
              <i className="dashboard-donut__segment dashboard-donut__segment--right" />
              <i className="dashboard-donut__segment dashboard-donut__segment--bottom" />
              <i className="dashboard-donut__segment dashboard-donut__segment--left" />
              <div><strong>36</strong><span>总租户数</span></div>
            </div>
            <ul>
              <li><i className="blue" /><span>企业版</span><strong>45.0%</strong></li>
              <li><i className="cyan" /><span>专业版</span><strong>35.0%</strong></li>
              <li><i className="indigo" /><span>基础版</span><strong>20.0%</strong></li>
            </ul>
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel dashboard-activity">
          <header className="dashboard-panel__header">
            <h2><CheckCircleFilled /> 最新动态</h2>
            <a>更多 ›</a>
          </header>
          <ol>
            {activities.map(([time, text]) => (
              <li key={time}><time>{time}</time><span>{text}</span></li>
            ))}
          </ol>
        </article>

        <article className="dashboard-panel dashboard-quick">
          <header className="dashboard-panel__header">
            <h2><ThunderboltFilled /> 快捷入口</h2>
            <a>自定义 ›</a>
          </header>
          <div className="dashboard-quick__grid">
            {quickLinks.map((item) => (
              <button
                className={`dashboard-quick__item dashboard-tone--${item.tone}`}
                type="button"
                key={item.title}
                onClick={() => navigate(item.path)}
              >
                <span>{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

function Sparkline() {
  return (
    <svg className="dashboard-sparkline" viewBox="0 0 74 48" preserveAspectRatio="none" aria-hidden>
      <path d="M1 44 L16 22 L27 30 L43 8 L58 25 L72 14" />
    </svg>
  )
}
