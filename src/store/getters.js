const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  // 暴露路由数据
  roles: state => state.user.roles,
  buttons: state => state.user.buttons,
  routes: state => state.user.routes
}
export default getters
