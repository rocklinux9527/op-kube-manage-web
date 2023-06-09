import request from '@/utils/request'


export function get_user_list(query) {
  return request({
    url: '/api/user/query',
    method: 'get',
    params: query
  })
}


export function create_user_list(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data
  })
}
export function update_user_list(data) {
  return request({
    url: '/api/user/update',
    method: 'put',
    data
  })
}

export function delete_user_list(data) {
  return request({
    url: '/api/user/delete',
    method: 'delete',
    data
  })
}


export function login(data) {
  return request({
    url: '/api/user/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout/',
    method: 'post'
  })
}
