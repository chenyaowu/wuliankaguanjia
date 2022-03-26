import request from '@/utils/request'

// 获取用户列表
export function getUser(data) {
  return request({
    url: '/api/console/user/search',
    method: 'get',
    params: data
  })
}

export function saveUser(data) {
  return request({
    url: '/api/console/user/save',
    method: 'post',
    params: data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/console/user/delete',
    method: 'post',
    params: data
  })
}
export function deleteUserAnyway(data) {
  return request({
    url: '/api/console/user/delete/anyway',
    method: 'post',
    params: data
  })
}

export function resetPassword(data) {
  return request({
    url: '/api/console/user/reset/password',
    method: 'post',
    params: data
  })
}

export function switchUserStatus(data) {
  return request({
    url: '/api/console/user/switch/status',
    method: 'post',
    params: data
  })
}

