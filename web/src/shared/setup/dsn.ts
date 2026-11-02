import type { DsnFormValues } from './types'

/** Escape libpq keyword value when it contains spaces/quotes. */
function quoteValue(value: string): string {
  if (/[\s'\\]/.test(value)) {
    return `'${value.replace(/'/g, `\\'`)}'`
  }
  return value
}

/** Build a libpq keyword/value DSN from form fields. */
export function buildLibpqDsn(values: DsnFormValues): string {
  if (values.useAdvanced && values.advancedDsn.trim()) {
    return values.advancedDsn.trim()
  }

  const parts = [
    `host=${quoteValue(values.host.trim() || '127.0.0.1')}`,
    `port=${quoteValue(values.port.trim() || '5432')}`,
    `user=${quoteValue(values.user.trim())}`,
    `password=${quoteValue(values.password)}`,
    `dbname=${quoteValue(values.database.trim())}`,
    `sslmode=${quoteValue(values.sslmode || 'disable')}`,
  ]

  if (values.timezone.trim()) {
    parts.push(`TimeZone=${quoteValue(values.timezone.trim())}`)
  }

  return parts.join(' ')
}

export const defaultDsnForm: DsnFormValues = {
  host: '127.0.0.1',
  port: '5432',
  database: 'gra_admin',
  user: 'gra',
  password: '',
  sslmode: 'disable',
  timezone: 'Asia/Shanghai',
  useAdvanced: false,
  advancedDsn: '',
}

export const defaultAdminForm = {
  admin_username: 'admin',
  admin_password: '',
  admin_password_confirm: '',
  admin_display_name: '管理员',
  bootstrap_tenant_name: '默认租户',
}
