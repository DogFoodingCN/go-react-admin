import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components'

export type TenantFormValues = {
  name: string
  status: 'active' | 'disabled'
}

type TenantFormModalProps = {
  open: boolean
  title?: string
  initialValues?: Partial<TenantFormValues>
  onOpenChange: (open: boolean) => void
  onFinish: (values: TenantFormValues) => Promise<boolean> | boolean
}

/** 租户新建/编辑 · Modal + ProForm（name/status） */
export function TenantFormModal({
  open,
  title = '新建租户',
  initialValues,
  onOpenChange,
  onFinish,
}: TenantFormModalProps) {
  return (
    <ModalForm<TenantFormValues>
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      initialValues={{ status: 'active', ...initialValues }}
      modalProps={{ destroyOnClose: true, width: 480 }}
      onFinish={async (values) => onFinish(values)}
    >
      <ProFormText
        name="name"
        label="名称"
        placeholder="请输入租户名称"
        rules={[{ required: true, message: '请输入租户名称' }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        options={[
          { label: '启用', value: 'active' },
          { label: '停用', value: 'disabled' },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
    </ModalForm>
  )
}
