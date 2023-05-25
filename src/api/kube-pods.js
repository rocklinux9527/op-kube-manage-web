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

export function get_kube_sys_ns_all(query) {
  return request({
    url: '/v1/sys/k8s/ns/plan',
    method: 'get',
    params: query
  })
}
export function get_kube_pod_list(query) {
  return request({
    url: '/v1/kube/pod',
    method: 'get',
    params: query
  })
}

export function get_kube_mock_pod_list(query) {
  return request({
    url: '/v1/kube/pod/mock',
    method: 'get',
    params: query
  })
}

export function post_kube_pod_restart(data) {
  return request({
    url: '/v1/kube/pod/restart',
    method: 'post',
    data
  })
}

export function post_kube_pod_list(data) {
  return request({
    url: '/v1/kube/pod/',
    method: 'post',
    data
  })
}

export function put_kube_pod_list(data) {
  return request({
    url: '/v1/kube/pod',
    method: 'put',
    data
  })
}

export function delete_kube_pod_list(data) {
  return request({
    url: '/v1/kube/pod',
    method: 'delete',
    data
  })
}

