/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '运维管理',
    icon: 'component'
  },
  children: [
    {
      path: 'script-manager',
      component: () => import('@/views/scriptmanager/script-manager'),
      name: '模版配置',
      hidden: true,
      meta: { title: '模版配置' }
    },
    {
      path: 'templeManager',
      component: () => import('@/views/scriptmanager/List'),
      name: '模版管理',
      meta: { title: '模版配置' }
    }
  ]
}

export default componentsRouter
