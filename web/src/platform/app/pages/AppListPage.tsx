import { useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { Modal, Popconfirm, Tag, message } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'
import { EmptyState } from '@/shared/ui/EmptyState'

type AppRow = {
  code: string
  name: string
  enabled: boolean
}

const initialData: AppRow[] = [
  { code: 'demo', name: 'Demo 应用', enabled: true },
  { code: 'crm', name: 'CRM 应用', enabled: false },
]

export function AppListPage() {
  const [dataSource, setDataSource] = useState<AppRow[]>(initialData)

  const toggleApp = (row: AppRow) => {
    const next = !row.enabled
    setDataSource((prev) =>
      prev.map((item) =>
        item.code === row.code ? { ...item, enabled: next } : item,
      ),
    )
    message.success(next ? `已开通「${row.name}」（占位）` : `已停用「${row.name}」（占位）`)
  }

  const confirmEnable = (row: AppRow) => {
    Modal.confirm({
      title: '开通应用',
      content: `确认为本租户开通「${row.name}」？`,
      okText: '开通',
      cancelText: '取消',
      onOk: () => toggleApp(row),
    })
  }

  const columns: ProColumns<AppRow>[] = [
    { title: '应用代号', dataIndex: 'code', width: 140, copyable: true },
    { title: '显示名', dataIndex: 'name' },
    {
      title: '开通状态',
      dataIndex: 'enabled',
      width: 120,
      render: (_, row) =>
        row.enabled ? (
          <Tag color="processing">已开通</Tag>
        ) : (
          <Tag>未开通</Tag>
        ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, row) =>
        row.enabled
          ? [
              <Popconfirm
                key="disable"
                title="停用应用"
                description={`确认停用「${row.name}」？`}
                okText="停用"
                cancelText="取消"
                onConfirm={() => toggleApp(row)}
              >
                <a>停用</a>
              </Popconfirm>,
            ]
          : [
              <a key="enable" onClick={() => confirmEnable(row)}>
                开通
              </a>,
            ],
    },
  ]

  return (
    <PageContainer
      title="应用开通"
      description="租户与应用绑定（占位）。后端就绪后对接开通/停用。"
    >
      <ProTable<AppRow>
        rowKey="code"
        search={false}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <EmptyState description="暂无应用" /> }}
        toolBarRender={false}
      />
    </PageContainer>
  )
}
