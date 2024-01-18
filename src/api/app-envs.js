import request from '@/utils/request'


export function get_app_envs_list(query) {
  return request({
    url: '/app/environment',
    method: 'get',
    params: query
  })
}

export function create_app_envs_list(data) {
  return request({
    url: '/app/environment',
    method: 'post',
    data
  })
}
export function update_app_envs_list(data) {
  return request({
    url: '/app/environment',
    method: 'put',
    data
  })
}

export function delete_app_envs_list(data) {
  return request({
    url: '/app/environment',
    method: 'delete',
    data
  })
}

export function get_kube_envList(query) {
  return request({
    url: '/v1/kube/env/list/',
    method: 'get',
    params: query
  })
}

export function get_kube_cluserList(query) {
  return request({
    url: '/v1/kube/cluster/List/',
    method: 'get',
    params: query
  })
}

export function get_app_temples_list(query) {
  return request({
    url: '/app/template',
    method: 'get',
    params: query
  })
}

export function get_temples_list(query) {
  return request({
    url: '/template',
    method: 'get',
    params: query
  })
}

