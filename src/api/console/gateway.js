import request from '@/utils/request'

export function getGateway(data) {
  return request({
    url: '/console/gateway/search',
    method: 'get',
    params: data
  })
}

