import { Empty } from 'antd'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  description?: ReactNode
  children?: ReactNode
}

/** 通用空态，对齐 B/shared/empty */
export function EmptyState({
  description = '暂无数据',
  children,
}: EmptyStateProps) {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description}>
    {children}
  </Empty>
}
