import request from '@/utils/request'

export function get_kube_envList(query) {
  return request({
    url: '/v1/kube/env/list/',
    method: 'get',
    params: query
  })
}

export function get_kube_nsList(query) {
  return request({
    url: '/v1/db/k8s/ns/all/',
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


export function get_svc_name_list(query) {
  return request({
    url: '/v1/k8s/service/all/plan/',
    method: 'get',
    params: query
  })
}

export function get_svc_port_list(query) {
  return request({
    url: '/v1/k8s/service/svc-port/plan/',
    method: 'get',
    params: query
  })
}

export function get_kube_ingresse_list(query) {
  return request({
    url: '/v1/k8s/ingress/plan/',
    method: 'get',
    params: query
  })
}



export function post_kube_ingresse_list(data) {
  return request({
    url: '/v1/k8s/ingress/plan/',
    method: 'post',
    data
  })
}
export function put_kube_ingresse_list(data) {
  return request({
    url: '/v1/k8s/ingress/plan/',
    method: 'put',
    data
  })
}



export function delete_kube_ingresse_list(data) {
  return request({
    url: '/v1/k8s/ingress/plan/',
    method: 'delete',
    data
  })
}
