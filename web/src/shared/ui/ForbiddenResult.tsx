import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

type ForbiddenResultProps = {
  title?: string
  subTitle?: string
  onBack?: () => void
}

/** 无权限 403，对齐 B/shared/403 */
export function ForbiddenResult({
  title = '403',
  subTitle = '抱歉，您没有权限访问此页面',
  onBack,
}: ForbiddenResultProps) {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title={title}
      subTitle={subTitle}
      extra={
        <Button
          type="primary"
          onClick={() => (onBack ? onBack() : navigate('/platform/dashboard'))}
        >
          返回工作台
        </Button>
      }
    />
  )
}
