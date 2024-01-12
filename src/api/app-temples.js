import request from '@/utils/request'


export function get_app_temples_list(query) {
  return request({
    url: '/app/template',
    method: 'get',
    params: query
  })
}



export function create_app_temples_list(data) {
  return request({
    url: '/app/template',
    method: 'post',
    data
  })
}
export function update_app_temples_list(data) {
  return request({
    url: '/app/template',
    method: 'put',
    data
  })
}

export function delete_app_temples_list(data) {
  return request({
    url: '/app/template/',
    method: 'delete',
    data
  })
}
