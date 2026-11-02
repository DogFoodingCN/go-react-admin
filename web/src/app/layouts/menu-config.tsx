import {
  AppstoreOutlined,
  AuditOutlined,
  ClusterOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import type { MenuDataItem } from '@ant-design/pro-components'

/**
 * Static bootstrap menus（对齐 Figma Shell）。
 * 后续由后端按租户开通应用下发并过滤。
 */
export const defaultMenuData: MenuDataItem[] = [
  {
    path: '/platform/dashboard',
    name: '工作台',
    icon: <DashboardOutlined />,
  },
  {
    path: '/platform/tenants',
    name: '租户管理',
    icon: <ClusterOutlined />,
  },
  {
    path: '/platform/apps',
    name: '应用开通',
    icon: <AppstoreOutlined />,
  },
  {
    path: '/platform/iam',
    name: '用户角色',
    icon: <TeamOutlined />,
  },
  {
    path: '/platform/audit',
    name: '审计日志',
    icon: <AuditOutlined />,
  },
  {
    path: '/apps/demo',
    name: 'Demo 应用',
    icon: <ExperimentOutlined />,
    children: [
      {
        path: '/apps/demo/list',
        name: '示例列表',
      },
    ],
  },
]
