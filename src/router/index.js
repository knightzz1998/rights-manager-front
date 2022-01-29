import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由就是所有用户不需要任何权限也可以看到的路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      // TODO : 在集合里需要注意的是 name 和 title 不能一样, 否则会报错,二者冲突
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

// 异步路由, 一般是自己定义的, 需要用户有相应的权限才能访问的路由
export const allAsyncRoutes = [
  // TODO 系统管理路由
  {
    path: '/system',
    // 首先需要显示一级路由组件
    component: Layout,
    name: 'System',
    // 点击系统管理会自动重定向到用户管理路由
    redirect: 'user/list',
    meta: { title: '系统管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'user/list',
        name: 'User',
        meta: { title: '用户管理', icon: 'el-icon-user-solid' },
        component: () => import('@/views/system/user/index')
      },
      {
        path: 'role/list',
        name: 'Role',
        meta: { title: '角色管理', icon: 'el-icon-s-help' },
        component: () => import('@/views/system/role/index')
      },
      {
        path: 'rights/list',
        name: 'Rights',
        meta: { title: '权限管理', icon: 'el-icon-menu' },
        component: () => import('@/views/system/rights/index')
      },
      {
        path: 'params/list',
        name: 'Params',
        meta: { title: '参数管理', icon: 'el-icon-s-data' },
        component: () => import('@/views/system/params/index')
      }
    ]
  },
  {
    path: '/analysis',
    // 首先需要显示一级路由组件
    component: Layout,
    name: 'Analysis',
    // 点击系统管理会自动重定向到用户管理路由
    redirect: 'enterprise-overview/list',
    meta: { title: '数据展示', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'enterprise-overview/list',
        name: 'Enterprise',
        meta: { title: '企业活跃度概览', icon: 'el-icon-s-data' },
        component: () => import('@/views/analysis/enterprise-overview/index')
      },
      {
        path: 'individual-enterprise/list',
        name: 'Individual',
        meta: { title: '个人企业活跃度分析', icon: 'el-icon-s-data' },
        component: () => import('@/views/analysis/individual-enterprise/index')
      },
      {
        path: 'industrial-division/list',
        name: 'Industrial',
        meta: { title: '产业划分企业活跃度分析', icon: 'el-icon-s-data' },
        component: () => import('@/views/analysis/industrial-division/index')
      },
      {
        path: 'profession-division/list',
        name: 'Profession',
        meta: { title: '行业划分企业活跃度分析', icon: 'el-icon-s-data' },
        component: () => import('@/views/analysis/profession-division/index')
      },
      {
        path: 'whole-enterprise/list',
        name: 'Whole',
        meta: { title: '整体企业活跃度分析', icon: 'el-icon-s-data' },
        component: () => import('@/views/analysis/individual-enterprise/index')
      }
    ]
  }
]

// 任意路由, 用户输入的所有非法路由都会转到404路由界面
// 注册这个路由的时候, 一定要放到最后面
// 放后面的原因是, 路由是从上到下匹配的, 上面匹配不到就是非法路由,非法路由在最后面拦截到 404 页面
export const anyRoute = { path: '*', redirect: '/404', hidden: true }

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
