import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, allAsyncRoutes, anyRoute, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    // 登陆成功以后的token存储
    token: getToken(),
    // 登陆成功以后存储用户的名称
    name: '',
    // 登陆成功以后存储用户的头像
    avatar: '',
    // 保存用户角色权限信息
    roles: [],
    // 保存用户的按钮权限信息
    buttons: [],
    // 保存当前用户返回的name数组(routes)对应的异步路由数组（返回的数据是异步路由名称的数组)
    asyncRoutes: [],
    // 保存用户要用的所有路由, 包括常量路由, 异步路由, 任意路由
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // TODO 这里的 SET_AVATAR, SET_NAME 封装成一个 SET_USERINFO
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 登陆成功以后获取用户信息, 并设置
  SET_USERINFO(state, userInfo) {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
  },
  // TODO 拼接路由
  SET_ROUTES(state, asyncRoutes) {
    state.asyncRoutes = asyncRoutes
    // 拼接常量路由、异步路由和任意路由, 根据这个总的路由生成菜单
    state.routes = constantRoutes.concat(asyncRoutes, anyRoute)
    // 动态给路由器添加路由, 参数必须符合路由数组
    router.addRoutes([...asyncRoutes, anyRoute])
  }
}

// TODO 过滤异步路由方法
// 通过返回的用户异步路由名称数组，从所有的异步路由数组当中，过滤出用户的异步路由数组
function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  // allAsyncRoutes 是所有的异步路由, 现在要根据从后端获取的路由数组名称进行过滤
  // routeNames 是从后端获取的用户路由名称数组
  const asyncRoutes = allAsyncRoutes.filter(item => {
    // 如果当前路由是用户拥有的
    if (routeNames.indexOf(item.name) !== -1) {
      // 考虑子路由情况 , 当前路由有子路由并且子路由数组数量大于0
      if (item.children && item.children.length > 0) {
        // 如果当前这个路由是有子路由的，子路由也要去过滤出用户路由名称包含的
        item.children = filterAsyncRoutes(item.children, routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}

const actions = {
  // user login
  // 这里的 login 是 vuex 的action, 而不是发请求的api
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 这里的是发请求的 api
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        // 登陆成功以后先设置token
        commit('SET_TOKEN', data.token)
        // TODO 存储token到cookie当中
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // TODO 这里也要修改为 SET_USERINFO
        commit('SET_USERINFO', data)
        // TODO 需要把 data.routes 数组替换为 router 里面配置的路由数组而不是 路由名称 数组
        // data.routes返回的是这个用户所有的路由权限信息, 就是所有这个用户要注册的异步路由的名称name数组
        commit('SET_ROUTES', filterAsyncRoutes(allAsyncRoutes, data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter() // 重置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  // 命名空间, 开启后, 访问action getters 需要加上名称前缀 user/login
  // 开启命名空间后, 可以让多个模块有相同的 getter, action
  namespaced: true,
  state,
  mutations,
  actions
}

