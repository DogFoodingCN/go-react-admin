import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { Tag } from 'antd'
import { PageContainer } from '@/shared/ui/PageContainer'

type TenantRow = {
  id: string
  name: string
  status: 'active' | 'disabled'
}

const columns: ProColumns<TenantRow>[] = [
  { title: '租户 ID', dataIndex: 'id', width: 160 },
  { title: '名称', dataIndex: 'name' },
  {
    title: '状态',
    dataIndex: 'status',
    render: (_, row) =>
      row.status === 'active' ? (
        <Tag color="success">启用</Tag>
      ) : (
        <Tag>停用</Tag>
      ),
  },
]

const mockData: TenantRow[] = [
  { id: 'tenant-demo', name: 'Demo 租户', status: 'active' },
]

export function TenantListPage() {
  return (
    <PageContainer title="租户管理" description="平台超管维护租户（占位数据）。">
      <ProTable<TenantRow>
        rowKey="id"
        search={false}
        columns={columns}
        dataSource={mockData}
        pagination={false}
        toolBarRender={false}
      />
    </PageContainer>
  )
}
