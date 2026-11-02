import { useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { Tabs, Tag, Typography } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'
import { EmptyState } from '@/shared/ui/EmptyState'

type UserRow = {
  id: string
  username: string
  role: string
  status: 'active' | 'disabled'
}

type RoleRow = {
  id: string
  name: string
  code: string
  permissions: string
}

const mockUsers: UserRow[] = [
  {
    id: '1',
    username: 'admin',
    role: 'platform_admin',
    status: 'active',
  },
]

const mockRoles: RoleRow[] = [
  {
    id: '1',
    name: '平台超管',
    code: 'platform_admin',
    permissions: 'platform:*（占位）',
  },
  {
    id: '2',
    name: '租户管理员',
    code: 'tenant_admin',
    permissions: 'tenant:*（占位）',
  },
]

const userColumns: ProColumns<UserRow>[] = [
  { title: '用户名', dataIndex: 'username', width: 160 },
  { title: '角色', dataIndex: 'role' },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (_, row) =>
      row.status === 'active' ? (
        <Tag color="success">启用</Tag>
      ) : (
        <Tag>停用</Tag>
      ),
  },
  {
    title: '操作',
    valueType: 'option',
    width: 100,
    render: () => [<a key="edit">编辑</a>],
  },
]

const roleColumns: ProColumns<RoleRow>[] = [
  { title: '角色名', dataIndex: 'name', width: 160 },
  { title: '角色码', dataIndex: 'code', width: 160, copyable: true },
  {
    title: '权限',
    dataIndex: 'permissions',
    render: (_, row) => (
      <Typography.Text type="secondary">{row.permissions}</Typography.Text>
    ),
  },
  {
    title: '操作',
    valueType: 'option',
    width: 100,
    render: () => [<a key="edit">编辑</a>],
  },
]

export function IamPage() {
  const [activeKey, setActiveKey] = useState('users')

  return (
    <PageContainer title="用户角色" description="IAM / RBAC 占位页。">
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            key: 'users',
            label: '用户',
            children: (
              <ProTable<UserRow>
                rowKey="id"
                search={false}
                columns={userColumns}
                dataSource={mockUsers}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <EmptyState description="暂无用户" /> }}
                toolBarRender={false}
              />
            ),
          },
          {
            key: 'roles',
            label: '角色',
            children: (
              <ProTable<RoleRow>
                rowKey="id"
                search={false}
                columns={roleColumns}
                dataSource={mockRoles}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <EmptyState description="暂无角色" /> }}
                toolBarRender={false}
              />
            ),
          },
        ]}
      />
    </PageContainer>
  )
}
