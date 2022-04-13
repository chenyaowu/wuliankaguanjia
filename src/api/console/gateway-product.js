import request from '@/utils/request'

export function getGatewayProduct(data) {
  return request({
    url: '/console/gateway/product/map/search',
    method: 'get',
    params: data
  })
}
export function saveGatewayProduct(data) {
  return request({
    url: '/console/gateway/product/map/save',
    method: 'get',
    params: data
  })
}

export function updateGatewayProduct(data) {
  return request({
    url: '/console/gateway/product/map/update',
    method: 'get',
    params: data
  })
}

export function deleteGatewayProduct(data) {
  return request({
    url: '/console/gateway/product/map/delete',
    method: 'get',
    params: data
  })
}

