import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { PageContainer } from '@/shared/ui/PageContainer'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ForbiddenResult } from '@/shared/ui/ForbiddenResult'
import { usePermission } from '@/shared/access/usePermission'

type DemoRow = {
  id: string
  title: string
  remark: string
}

const columns: ProColumns<DemoRow>[] = [
  { title: 'ID', dataIndex: 'id', width: 120 },
  { title: '标题', dataIndex: 'title' },
  { title: '备注', dataIndex: 'remark', ellipsis: true },
]

const mockData: DemoRow[] = [
  {
    id: '1',
    title: '首个业务应用切片',
    remark: 'tenant=tenant-demo',
  },
]

export function DemoListPage() {
  const canRead = usePermission('demo:item:read')

  if (!canRead) {
    return (
      <PageContainer title="Demo · 示例列表">
        <ForbiddenResult subTitle="缺少权限码 demo:item:read" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Demo · 示例列表"
      description="业务应用示例页，权限码前缀约定 demo:*。"
    >
      <ProTable<DemoRow>
        rowKey="id"
        search={false}
        columns={columns}
        dataSource={mockData}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <EmptyState description="暂无示例数据" /> }}
        toolBarRender={false}
      />
    </PageContainer>
  )
}
