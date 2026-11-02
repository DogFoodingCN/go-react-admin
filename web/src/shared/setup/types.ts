export type SetupState = 'need_setup' | 'ready' | 'db_unreachable'

export type SetupStatus = {
  state: SetupState
  initialized: boolean
  dsn_persisted?: boolean
  db_reachable?: boolean
  migrations_pending?: boolean
  has_admin?: boolean
  message?: string
}

export type TestConnectionRequest = {
  dsn: string
}

export type TestConnectionResult = {
  ok: boolean
  message?: string
}

export type InitializeRequest = {
  dsn: string
  admin_username: string
  admin_password: string
  admin_display_name?: string
  bootstrap_tenant_name?: string
}

export type ApiBody<T> = {
  code: number
  message: string
  data?: T
}

export type DsnFormValues = {
  host: string
  port: string
  database: string
  user: string
  password: string
  sslmode: string
  timezone: string
  useAdvanced: boolean
  advancedDsn: string
}

export type AdminFormValues = {
  admin_username: string
  admin_password: string
  admin_password_confirm: string
  admin_display_name: string
  bootstrap_tenant_name: string
}

export type SetupDraft = {
  dsn: DsnFormValues
  admin: AdminFormValues
}
