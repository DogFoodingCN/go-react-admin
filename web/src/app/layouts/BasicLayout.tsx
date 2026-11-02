import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { Dropdown, Typography } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/shared/auth/auth-store'
import { useTenantStore } from '@/shared/tenant/tenant-store'
import { defaultMenuData } from '@/app/layouts/menu-config'

export function BasicLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const userName = useAuthStore((s) => s.userName)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const tenantName = useTenantStore((s) => s.tenantName)
  const clearTenant = useTenantStore((s) => s.clearTenant)

  return (
    <div style={{ height: '100%' }}>
      <ProLayout
        title="Go-React-Admin"
        logo="/brand/logo-mark.svg"
        layout="mix"
        navTheme="realDark"
        fixedHeader
        fixSiderbar
        token={{
          header: {
            colorBgHeader: '#001529',
            colorHeaderTitle: '#fff',
            colorTextMenu: 'rgba(255,255,255,0.85)',
          },
          sider: {
            colorMenuBackground: '#001529',
            colorTextMenu: 'rgba(255,255,255,0.75)',
            colorTextMenuSelected: '#fff',
            colorBgMenuItemSelected: 'rgba(255,255,255,0.12)',
          },
        }}
        location={{ pathname: location.pathname }}
        route={{ path: '/', routes: defaultMenuData }}
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
        avatarProps={{
          icon: <UserOutlined />,
          title: userName || '未登录',
          render: (_props, dom) => (
            <Dropdown
              menu={{
                items: [
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
              {dom}
            </Dropdown>
          ),
        }}
        actionsRender={() => [
          <Typography.Text
            key="tenant"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            租户 · {tenantName || '未选择'}
          </Typography.Text>,
        ]}
      >
        <Outlet />
      </ProLayout>
    </div>
  )
}
