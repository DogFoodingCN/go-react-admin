import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { Dropdown, Space, Typography } from 'antd'
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
        title="go-react-admin"
        logo="/vite.svg"
        layout="mix"
        fixedHeader
        fixSiderbar
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
          <Space key="tenant" size={4}>
            <Typography.Text type="secondary">租户</Typography.Text>
            <Typography.Text>{tenantName || '未选择'}</Typography.Text>
          </Space>,
        ]}
      >
        <Outlet />
      </ProLayout>
    </div>
  )
}
