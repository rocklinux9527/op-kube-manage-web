import request from '@/utils/request'

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

export function get_kube_configList(query) {
  return request({
    url: '/v1/kube/config',
    method: 'get',
    params: query
  })
}
export function get_k8s_kube_cluster_check(query) {
  return request({
    url: '/check-kube-cluster',
    method: 'get',
    params: query
  })
}
export function post_kube_configList(data) {
  return request({
    url: '/v1/kube/config',
    method: 'post',
    data
  })
}
export function put_kube_configList(data) {
  return request({
    url: '/v1/kube/config',
    method: 'put',
    data
  })
}

export function delete_kube_configList(data) {
  return request({
    url: '/v1/kube/config',
    method: 'delete',
    data
  })
}
