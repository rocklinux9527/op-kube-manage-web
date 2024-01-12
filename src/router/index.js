import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import tableRouter from './modules/table'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: '应用',
    meta: { title: '应用', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: '应用',
        component: () => import('@/views/application/index'),
        meta: { title: '应用管理', icon: 'table' }
      },
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/k8s',
    component: Layout,
    redirect: '/k8s/page',
    alwaysShow: true, // will always show the root menu
    name: 'K8S管理',
    meta: {
      title: 'K8S管理',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'cluster',
        component: () => import('@/views/k8s/cluster'),
        meta: {
          title: '集群管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'namespace',
        component: () => import('@/views/k8s/namespace'),
        meta: {
          title: '命名空间',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'Pods',
        component: () => import('@/views/k8s/kube_pods'),
        meta: {
          title: 'Pods管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'deployment',
        component: () => import('@/views/k8s/deployment'),
        meta: {
          title: '服务部署',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'srvice',
        component: () => import('@/views/k8s/service'),
        name: 'Service',
        meta: {
          title: 'SVC管理',
          roles: ['admin']
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'ingress',
        component: () => import('@/views/k8s/ingress'),
        name: 'Ingress管理',
        meta: {
          title: '域名管理'
          // if do not set roles, means: this page does not require permission
        }
      },
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  componentsRouter,
  /** nestedRouter, **/
  tableRouter,

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234//issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
