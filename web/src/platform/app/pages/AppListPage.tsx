import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { Tag } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'

type AppRow = {
  code: string
  name: string
  enabled: boolean
}

const columns: ProColumns<AppRow>[] = [
  { title: '应用代号', dataIndex: 'code', width: 140 },
  { title: '显示名', dataIndex: 'name' },
  {
    title: '当前租户',
    dataIndex: 'enabled',
    render: (_, row) =>
      row.enabled ? <Tag color="processing">已开通</Tag> : <Tag>未开通</Tag>,
  },
]

const mockData: AppRow[] = [{ code: 'demo', name: 'Demo 应用', enabled: true }]

export function AppListPage() {
  return (
    <PageContainer
      title="应用开通"
      description="租户与应用绑定（占位）。后端就绪后对接开通/停用。"
    >
      <ProTable<AppRow>
        rowKey="code"
        search={false}
        columns={columns}
        dataSource={mockData}
        pagination={false}
        toolBarRender={false}
      />
    </PageContainer>
  )
}
