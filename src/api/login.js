import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/welcome/user/signin',
    method: 'post',
    params: data
  })
}

export function getInfo(data) {
  return request({
    url: '/api/console/user/search',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: '/api/welcome/user/signout',
    method: 'post'
  })
}
