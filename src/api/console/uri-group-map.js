import request from '@/utils/request'

export function batchSaveUriGroupMap(data) {
  return request({
    url: '/console/uri/group/map/batch/save',
    method: 'post',
    params: data
  })
}

export function deleteUriGroupMap(data) {
  return request({
    url: '/console/uri/group/map/delete',
    method: 'post',
    params: data
  })
}
