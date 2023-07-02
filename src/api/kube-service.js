import request from '@/utils/request'

export function get_kube_envList(query) {
  return request({
    url: '/api/v1/kube/env/list/',
    method: 'get',
    params: query
  })
}

export function get_kube_nsList(query) {
  return request({
    url: '/api/v1/db/k8s/ns/all/',
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

export function get_kube_service_list(query) {
  return request({
    url: '/api/v1/k8s/service/plan/',
    method: 'get',
    params: query
  })
}


export function post_kube_service_list(data) {
  return request({
    url: '/api/v1/k8s/service/plan/',
    method: 'post',
    data
  })
}
export function put_kube_service_list(data) {
  return request({
    url: '/api/v1/k8s/service/plan/',
    method: 'put',
    data
  })
}



export function delete_kube_service_list(data) {
  return request({
    url: '/api/v1/k8s/service/plan/',
    method: 'delete',
    data
  })
}
