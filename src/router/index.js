import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
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
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: '/console',
    component: Layout,
    redirect: '/console/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/console/index'),
        name: 'ConsoleIndex',
        meta: { title: '首页', icon: 'el-icon-s-home', affix: true }
      }
    ]
  },
  {
    path: '/console/system',
    component: Layout,
    redirect: '/console/system/user/list',
    meta: { title: '系统设置', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'user/list',
        component: () => import('@/views/console/system/user/index'),
        name: 'ConsoleSystemUserList',
        meta: { title: '用户管理', icon: 'user', uri: 'console.page.user.list' }
      },
      {
        path: 'user/config/list',
        component: () => import('@/views/console/system/user-config/index'),
        name: 'ConsoleSystemUserConfigList',
        meta: { title: '用户配置', icon: 'el-icon-setting', uri: 'console.page.user.config.list' }
      },
      {
        path: 'uri/list',
        component: () => import('@/views/console/system/uri/index'),
        name: 'ConsoleSystemUserUriList',
        meta: { title: '资源管理', icon: 'el-icon-folder', uri: 'console.page.uri.list' }
      },
      {
        path: 'uri/group/list',
        component: () => import('@/views/console/system/uri-group/index'),
        name: 'ConsoleSystemUserUriGroupList',
        meta: { title: '资源组管理', icon: 'el-icon-folder-opened', uri: 'console.page.uri.group.list' }
      },
      {
        path: 'datadict/list',
        component: () => import('@/views/console/system/datadict/index'),
        name: 'ConsoleSystemDatadictList',
        meta: { title: '数据字典', icon: 'el-icon-collection', uri: 'console.page.datadict.list' }
      },
      {
        path: 'function/list',
        component: () => import('@/views/console/system/function/index'),
        name: 'ConsoleSystemFunctionList',
        meta: { title: '功能管理', icon: 'el-icon-s-grid', uri: 'console.page.function.list' }
      },
      {
        path: 'product/list',
        component: () => import('@/views/console/system/product/index'),
        name: 'ConsoleSystemProductList',
        meta: { title: '套餐管理', icon: 'el-icon-s-data', uri: 'console.page.product.list' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
