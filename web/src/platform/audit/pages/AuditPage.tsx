import { useMemo, useState } from 'react'
import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { Button, Card, Col, DatePicker, Input, Row, Space } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import { PageContainer } from '@/shared/ui/PageContainer'
import { EmptyState } from '@/shared/ui/EmptyState'

type AuditRow = {
  id: string
  time: string
  operator: string
  action: string
  summary: string
}

type DateRangeValue = RangePickerProps['value']

const mockData: AuditRow[] = [
  {
    id: '1',
    time: '2026-11-02 10:00',
    operator: 'admin',
    action: 'setup.initialize',
    summary: '系统初始化完成',
  },
  {
    id: '2',
    time: '2026-11-02 10:05',
    operator: 'admin',
    action: 'tenant.create',
    summary: '创建租户 Demo 租户',
  },
  {
    id: '3',
    time: '2026-11-01 18:20',
    operator: 'ops',
    action: 'app.enable',
    summary: '开通应用 demo',
  },
]

const columns: ProColumns<AuditRow>[] = [
  { title: '时间', dataIndex: 'time', width: 180 },
  { title: '操作人', dataIndex: 'operator', width: 120 },
  { title: '动作', dataIndex: 'action', width: 180, copyable: true },
  { title: '摘要', dataIndex: 'summary', ellipsis: true },
]

export function AuditPage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(null)
  const [operator, setOperator] = useState('')
  const [action, setAction] = useState('')
  const [filters, setFilters] = useState<{
    operator: string
    action: string
    range: DateRangeValue
  }>({
    operator: '',
    action: '',
    range: null,
  })

  const filtered = useMemo(() => {
    return mockData.filter((row) => {
      if (
        filters.operator &&
        !row.operator.toLowerCase().includes(filters.operator.toLowerCase())
      ) {
        return false
      }
      if (
        filters.action &&
        !row.action.toLowerCase().includes(filters.action.toLowerCase())
      ) {
        return false
      }
      if (filters.range?.[0] && filters.range?.[1]) {
        const start = filters.range[0].startOf('day')
        const end = filters.range[1].endOf('day')
        const t = new Date(row.time.replace(' ', 'T')).getTime()
        if (t < start.valueOf() || t > end.valueOf()) return false
      }
      return true
    })
  }, [filters])

  const handleSearch = () => {
    setFilters({
      operator: operator.trim(),
      action: action.trim(),
      range: dateRange,
    })
  }

  const handleReset = () => {
    setDateRange(null)
    setOperator('')
    setAction('')
    setFilters({ operator: '', action: '', range: null })
  }

  return (
    <PageContainer title="审计日志" description="操作审计占位页。">
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={8}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <span>时间范围</span>
              <DatePicker.RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={(v) => setDateRange(v)}
                placeholder={['开始', '结束']}
              />
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <span>操作人</span>
              <Input
                allowClear
                placeholder="全部"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                onPressEnter={handleSearch}
              />
            </Space>
          </Col>
          <Col xs={24} md={6}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <span>动作</span>
              <Input
                allowClear
                placeholder="如 setup.initialize"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onPressEnter={handleSearch}
              />
            </Space>
          </Col>
          <Col xs={24} md={4}>
            <Space style={{ marginTop: 22 }}>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <ProTable<AuditRow>
        rowKey="id"
        search={false}
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: <EmptyState description="暂无审计记录" /> }}
        toolBarRender={false}
      />
    </PageContainer>
  )
}
