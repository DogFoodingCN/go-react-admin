import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { App, Avatar, Badge, Button, Dropdown, Empty, Popover, Space, Typography } from 'antd'
import {
  BellOutlined,
  DownOutlined,
  FullscreenOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RightOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/shared/auth/auth-store'
import { useTenantStore } from '@/shared/tenant/tenant-store'
import { defaultMenuData } from '@/app/layouts/menu-config'

export function BasicLayout() {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const userName = useAuthStore((s) => s.userName)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const tenantName = useTenantStore((s) => s.tenantName)
  const clearTenant = useTenantStore((s) => s.clearTenant)

  return (
    <div className="app-shell">
      <ProLayout
        title="go-react-admin"
        logo="/brand/logo-mark.svg"
        layout="side"
        navTheme="light"
        siderWidth={240}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsedButtonRender={false}
        headerRender={false}
        fixSiderbar
        token={{
          header: {
            heightLayoutHeader: 64,
            colorBgHeader: '#fff',
            colorHeaderTitle: '#172b4d',
            colorTextMenu: '#172b4d',
          },
          sider: {
            colorMenuBackground: '#071d57',
            colorTextMenu: '#b8c8e8',
            colorTextMenuSelected: '#fff',
            colorBgMenuItemSelected: '#1769e8',
          },
        }}
        location={{ pathname: location.pathname }}
        route={{ path: '/', routes: defaultMenuData }}
        contentStyle={{ margin: 0, padding: 0 }}
        menuContentRender={() => (
          <nav className="sidebar-exact-menu" aria-label="主导航">
            {defaultMenuData.map((item) => {
              const selected =
                item.path === '/platform/dashboard'
                  ? location.pathname === item.path
                  : Boolean(item.path && location.pathname.startsWith(item.path))
              return (
                <button
                  className={selected ? 'is-selected' : undefined}
                  type="button"
                  key={item.path}
                  onClick={() => item.path && navigate(item.path)}
                >
                  <span className="sidebar-exact-menu__icon">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.children?.length ? <DownOutlined className="sidebar-exact-menu__arrow" /> : null}
                </button>
              )
            })}
          </nav>
        )}
        menuItemRender={(item, dom) => (
          <a
            onClick={(e) => {
              e.preventDefault()
              if (item.path) navigate(item.path)
            }}
          >
            {dom}
          </a>
        )}
      >
        <div className="shell-main">
          <header className="shell-header">
            <div className="shell-header-left">
              <Button
                type="text"
                className="shell-icon-button"
                aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((value) => !value)}
              />
              <div className="shell-breadcrumb">
                <span>租户</span>
                <RightOutlined />
                <strong>工作台</strong>
              </div>
            </div>
            <Space size={8}>
              <button className="shell-tenant-select" type="button">
                {tenantName || '默认租户'} <DownOutlined />
              </button>
              <Popover
                trigger="click"
                placement="bottomRight"
                content={
                  <section className="shell-notification-panel">
                    <header>
                      <Typography.Title level={5}>消息通知</Typography.Title>
                      <Typography.Link>全部已读</Typography.Link>
                    </header>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Space direction="vertical" size={2}>
                          <Typography.Text strong>暂无新通知</Typography.Text>
                          <Typography.Text type="secondary">
                            系统消息会在这里显示
                          </Typography.Text>
                        </Space>
                      }
                    />
                  </section>
                }
              >
                <Button
                  type="text"
                  className="shell-icon-button"
                  aria-label="消息通知"
                  icon={
                    <Badge count={5} size="small">
                      <BellOutlined />
                    </Badge>
                  }
                />
              </Popover>
              <span className="shell-header-divider" />
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      key: 'settings',
                      icon: <SettingOutlined />,
                      label: '个人设置',
                      onClick: () => message.info('个人设置功能待接入'),
                    },
                    { type: 'divider' },
                    {
                      key: 'logout',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: () => {
                        clearAuth()
                        clearTenant()
                        navigate('/login', { replace: true })
                      },
                    },
                  ],
                }}
              >
                <Button type="text" className="shell-user-trigger">
                  <Avatar size={32} icon={<UserOutlined />} />
                  <span className="shell-user-title">
                    <strong>{userName || '未登录'}</strong>
                  </span>
                  <DownOutlined />
                </Button>
              </Dropdown>
              <Button
                type="text"
                className="shell-icon-button"
                aria-label="全屏"
                icon={<FullscreenOutlined />}
              />
            </Space>
          </header>
          <main className={location.pathname === '/platform/dashboard' ? 'shell-content shell-content--dashboard' : 'shell-content'}>
            <Outlet />
          </main>
        </div>
      </ProLayout>
    </div>
  )
}
