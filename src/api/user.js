import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/welcome/user/signin',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/console/user/search',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/welcome/user/signout',
    method: 'post'
  })
}
export function getUser(data) {
  return request({
    url: '/console/user/search',
    method: 'get',
    data
  })
}
