import request from '@/utils/request'

export function login(data) {
  // TODO url 不要写成 login, 而是 /login, 因为最终路径是 VUE_APP_BASE_API + URL 拼接成的
  // 然后在 vue.config.js 里的 proxy 把 dev-api 替换为 ''
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'logout',
    method: 'post'
  })
}
