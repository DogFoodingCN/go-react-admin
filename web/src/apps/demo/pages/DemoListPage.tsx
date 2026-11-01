import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { PageContainer } from '@/shared/ui/PageContainer'

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
    remark: '目录对齐 server/internal/apps/demo',
  },
]

export function DemoListPage() {
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
        pagination={false}
        toolBarRender={false}
      />
    </PageContainer>
  )
}
