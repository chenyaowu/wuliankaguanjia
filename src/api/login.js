import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/welcome/user/signin',
    method: 'post',
    params: data
  })
}

export function getInfo(data) {
  return request({
    url: '/console/user/search',
    method: 'post',
    params: data
  })
}

export function logout() {
  return request({
    url: '/welcome/user/signout',
    method: 'post'
  })
}
