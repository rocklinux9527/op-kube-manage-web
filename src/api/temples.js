import request from '@/utils/request'


export function get_temples_list(query) {
  return request({
    url: '/template',
    method: 'get',
    params: query
  })
}

export function download_temples_list(query) {
  return request({
    url: '/template/download/',
    method: 'get',
    params: query
  })
}

export function create_temples_list(data) {
  return request({
    url: '/template',
    method: 'post',
    data
  })
}
export function update_temples_list(data) {
  return request({
    url: '/template',
    method: 'put',
    data
  })
}

export function delete_temples_list(data) {
  return request({
    url: '/template',
    method: 'delete',
    data
  })
}
