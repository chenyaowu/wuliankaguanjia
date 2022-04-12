import request from '@/utils/request'

export function getProduct(data) {
  return request({
    url: '/console/product/search',
    method: 'get',
    params: data
  })
}

export function saveProduct(data) {
  return request({
    url: '/console/product/save',
    method: 'post',
    params: data
  })
}

export function updateProduct(data) {
  return request({
    url: '/console/product/update',
    method: 'post',
    params: data
  })
}

export function deleteProduct(data) {
  return request({
    url: '/console/product/delete',
    method: 'post',
    params: data
  })
}

