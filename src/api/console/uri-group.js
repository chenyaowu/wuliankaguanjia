import request from '@/utils/request'

// 获取资源列表
export function getUriGroup(data) {
  return request({
    url: '/api/console/uri/group/find',
    method: 'get',
    params: data
  })
}

export function saveUriGroup(data) {
  return request({
    url: '/api/console/uri/group/save',
    method: 'post',
    params: data
  })
}
export function updateUriGroup(data) {
  return request({
    url: '/api/console/uri/group/update',
    method: 'post',
    params: data
  })
}

export function deleteUriGroup(data) {
  return request({
    url: '/api/console/uri/group/delete',
    method: 'post',
    params: data
  })
}
