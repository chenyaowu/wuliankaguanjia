import request from '@/utils/request'

// 获取平台列表
export function getPlatform(data) {
  return request({
    url: '/console/platform/search',
    method: 'get',
    params: data
  })
}
