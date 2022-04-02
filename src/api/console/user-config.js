import request from '@/utils/request'

// 获取用户配置列表
export function getUserConfig(data) {
  return request({
    url: '/api/console/user/config/search',
    method: 'get',
    params: data
  })
}

// 添加用户配置列表
export function saveUserConfig(data) {
  return request({
    url: '/api/console/user/config/save',
    method: 'get',
    params: data
  })
}

// 更新用户配置列表
export function updateUserConfig(data) {
  return request({
    url: '/api/console/user/config/update',
    method: 'get',
    params: data
  })
}

// 删除用户配置列表
export function delUserConfig(data) {
  return request({
    url: '/api/console/user/config/delete',
    method: 'get',
    params: data
  })
}
