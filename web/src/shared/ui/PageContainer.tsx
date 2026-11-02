import type { ReactNode } from 'react'
import { Typography } from 'antd'
import { rem } from '@/shared/style/rem'

type PageContainerProps = {
  title: string
  description?: string
  extra?: ReactNode
  children?: ReactNode
}

export function PageContainer({
  title,
  description,
  extra,
  children,
}: PageContainerProps) {
  return (
    <div style={{ padding: rem(24) }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: rem(16),
          gap: rem(16),
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {description ? (
            <Typography.Text type="secondary">{description}</Typography.Text>
          ) : null}
        </div>
        {extra}
      </div>
      {children}
    </div>
  )
}
