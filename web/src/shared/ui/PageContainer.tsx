import type { ReactNode } from 'react'
import { Typography } from 'antd'

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
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
          gap: 16,
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
