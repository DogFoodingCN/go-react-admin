import { apiClient } from '@/shared/api/client'
import type { ApiBody } from '@/shared/setup/types'

export type TenantItem = {
  id: string
  name: string
  status: 'active' | 'disabled' | string
}

type PageResult<T> = {
  list: T[]
  total: number
  page: number
  page_size: number
}

function unwrap<T>(body: ApiBody<T>): T {
  if (body.code !== 0) {
    throw new Error(body.message || '请求失败')
  }
  return body.data as T
}

export async function listTenants(params?: {
  page?: number
  pageSize?: number
}): Promise<PageResult<TenantItem>> {
  const { data } = await apiClient.get<ApiBody<PageResult<TenantItem>>>(
    '/v1/platform/tenants',
    {
      params: {
        page: params?.page,
        page_size: params?.pageSize,
      },
    },
  )
  return unwrap(data)
}

export async function createTenant(body: {
  name: string
  status?: string
}): Promise<TenantItem> {
  const { data } = await apiClient.post<ApiBody<TenantItem>>(
    '/v1/platform/tenants',
    body,
  )
  return unwrap(data)
}

export async function updateTenant(
  id: string,
  body: { name: string; status: string },
): Promise<TenantItem> {
  const { data } = await apiClient.patch<ApiBody<TenantItem>>(
    `/v1/platform/tenants/${id}`,
    body,
  )
  return unwrap(data)
}
