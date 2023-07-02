import request from '@/utils/request'

export function get_kube_envList(query) {
  return request({
    url: '/api/v1/kube/env/list/',
    method: 'get',
    params: query
  })
}

export function get_kube_cluserList(query) {
  return request({
    url: '/api/v1/kube/cluster/List/',
    method: 'get',
    params: query
  })
}

export function get_kube_namespaceList(query) {
  return request({
    url: '/api/v1/db/k8s/ns/plan/',
    method: 'get',
    params: query
  })
}

export function post_kube_namespaceList(data) {
  return request({
    url: '/api/v1/db/k8s/ns/plan/',
    method: 'post',
    data
  })
}
