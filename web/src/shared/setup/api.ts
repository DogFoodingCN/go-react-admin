import axios from 'axios'
import { apiClient } from '@/shared/api/client'
import type {
  ApiBody,
  InitializeRequest,
  SetupStatus,
  TestConnectionRequest,
  TestConnectionResult,
} from './types'

function unwrap<T>(body: ApiBody<T>): T {
  if (body.code !== 0) {
    throw new Error(body.message || '请求失败')
  }
  return body.data as T
}

export function getApiErrorMessage(err: unknown, fallback = '请求失败'): string {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as ApiBody<unknown> | undefined
    if (body?.message) return body.message
    if (err.message) return err.message
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}

export async function fetchSetupStatus(): Promise<SetupStatus> {
  const { data } = await apiClient.get<ApiBody<SetupStatus>>('/v1/setup/status')
  return unwrap(data)
}

export async function testConnection(
  req: TestConnectionRequest,
): Promise<TestConnectionResult> {
  const { data } = await apiClient.post<ApiBody<TestConnectionResult>>(
    '/v1/setup/test-connection',
    req,
  )
  return unwrap(data)
}

export async function initializeSetup(
  req: InitializeRequest,
): Promise<unknown> {
  const { data } = await apiClient.post<ApiBody<unknown>>(
    '/v1/setup/initialize',
    req,
  )
  return unwrap(data)
}

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResult = {
  token: string
  user_name: string
  tenant_id?: string
  tenant_name?: string
  note?: string
}

export async function login(req: LoginRequest): Promise<LoginResult> {
  const { data } = await apiClient.post<ApiBody<LoginResult>>(
    '/v1/auth/login',
    req,
  )
  return unwrap(data)
}
