import request from '@/utils/request'

// 获取资源列表
export function getDatadict(data) {
  return request({
    url: '/api/console/datadict/find',
    method: 'get',
    params: data
  })
}

export function saveDatadict(data) {
  return request({
    url: '/api/console/datadict/save',
    method: 'post',
    params: data
  })
}
export function updateDatadict(data) {
  return request({
    url: '/api/console/datadict/update',
    method: 'post',
    params: data
  })
}

export function deleteDatadict(data) {
  return request({
    url: '/api/console/datadict/delete',
    method: 'post',
    params: data
  })
}
