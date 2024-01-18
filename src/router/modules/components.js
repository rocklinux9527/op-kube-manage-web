/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  alwaysShow: true,
  meta: {
    title: '运维管理',
    icon: 'component'
  },
  children: [
    {
      path: 'temple-manager',
      component: () => import('@/views/temple-manager/temple_tabs'),
      name: '模版管理',
     // hidden: true,
      meta: { title: '模版配置' }
    },
    {
      path: 'env-manager',
      component: () => import('@/views/env-manager/index'),
      name: '环境配置',
      meta: { title: '环境配置' }
    },
    {
      path: 'envs-form',
      component: () => import('@/views/application/envs_tabs'),
      name: 'Container配置',
      hidden: true,
      meta: { title: '容器配置' }
    },

    
     

    // {
    //   path: 'templeManager',
    //   component: () => import('@/views/scriptmanager/List'),
    //   name: '模版管理',
    //   meta: { title: '模版配置' }
    // }
  ]
}

export default componentsRouter
