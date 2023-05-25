/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/complex-table',
  name: '系统设置',
  meta: {
    title: '系统设置',
    icon: 'table',
    roles: ['admin', 'editor']
  },
  children: [
    {
      path: 'sys-user',
      component: () => import('@/views/system/system-user'),
      meta: { title: '用户管理' }
    }
  ],
}
export default tableRouter
