import request from '@/utils/request'

// 获取资源列表
export function getUri(data) {
  return request({
    url: '/console/uri/find',
    method: 'get',
    params: data
  })
}

export function saveUri(data) {
  return request({
    url: '/console/uri/save',
    method: 'post',
    params: data
  })
}
export function updateUri(data) {
  return request({
    url: '/console/uri/update',
    method: 'post',
    params: data
  })
}

export function deleteUri(data) {
  return request({
    url: '/console/uri/delete',
    method: 'post',
    params: data
  })
}

export function searchSelectedUri(data) {
  return request({
    url: '/console/uri/search/selected/uri',
    method: 'post',
    params: data
  })
}

export function searchUnselectUri(data) {
  return request({
    url: '/console/uri/search/unselect/uri',
    method: 'post',
    params: data
  })
}
