import { useRef, useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { App, Button, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PageContainer } from '@/shared/ui/PageContainer'
import { EmptyState } from '@/shared/ui/EmptyState'
import { getApiErrorMessage } from '@/shared/setup/api'
import {
  createTenant,
  listTenants,
  updateTenant,
  type TenantItem,
} from '@/platform/tenant/api'
import {
  TenantFormModal,
  type TenantFormValues,
} from '@/platform/tenant/pages/TenantFormModal'

export function TenantListPage() {
  const { message } = App.useApp()
  const actionRef = useRef<ActionType>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TenantItem | null>(null)

  const columns: ProColumns<TenantItem>[] = [
    { title: '租户 ID', dataIndex: 'id', width: 220, copyable: true, ellipsis: true },
    { title: '名称', dataIndex: 'name' },
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
      render: (_, row) => [
        <a
          key="edit"
          onClick={() => {
            setEditing(row)
            setModalOpen(true)
          }}
        >
          编辑
        </a>,
      ],
    },
  ]

  const handleFinish = async (values: TenantFormValues) => {
    try {
      if (editing) {
        await updateTenant(editing.id, values)
        message.success('租户已更新')
      } else {
        await createTenant(values)
        message.success('租户已创建')
      }
      setEditing(null)
      void actionRef.current?.reload()
      return true
    } catch (err) {
      message.error(getApiErrorMessage(err, '保存失败'))
      return false
    }
  }

  return (
    <PageContainer
      title="租户管理"
      description="平台超管维护租户（对接 /api/v1/platform/tenants）。"
    >
      <ProTable<TenantItem>
        actionRef={actionRef}
        rowKey="id"
        search={false}
        columns={columns}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <EmptyState description="暂无租户" /> }}
        request={async (params) => {
          try {
            const res = await listTenants({
              page: params.current,
              pageSize: params.pageSize,
            })
            return {
              data: res.list || [],
              total: res.total,
              success: true,
            }
          } catch (err) {
            message.error(getApiErrorMessage(err, '加载租户失败'))
            return { data: [], total: 0, success: false }
          }
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            新建租户
          </Button>,
        ]}
      />
      <TenantFormModal
        open={modalOpen}
        title={editing ? '编辑租户' : '新建租户'}
        initialValues={
          editing
            ? { name: editing.name, status: editing.status as 'active' | 'disabled' }
            : { status: 'active' }
        }
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditing(null)
        }}
        onFinish={handleFinish}
      />
    </PageContainer>
  )
}
