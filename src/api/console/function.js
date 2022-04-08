import request from '@/utils/request'

export function getFunction(data) {
  return request({
    url: '/api/console/function/search',
    method: 'get',
    params: data
  })
}

export function saveFunction(data) {
  return request({
    url: '/api/console/function/save',
    method: 'post',
    params: data
  })
}

export function deleteFunction(data) {
  return request({
    url: '/api/console/function/delete',
    method: 'post',
    params: data
  })
}

