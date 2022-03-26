import request from '@/utils/request'

// 获取公司列表
export function getCompany(data) {
  return request({
    url: '/api/console/company/search',
    method: 'get',
    params: data
  })
}
