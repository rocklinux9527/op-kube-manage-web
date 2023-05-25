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

export function get_imagesList(query) {
  return request({
    url: '/api/image',
    method: 'get',
    params: query
  })
}


export function get_kube_deploy_list(query) {
  return request({
    url: '/v1/k8s/deployment/plan/',
    method: 'get',
    params: query
  })
}

export function post_kube_deploy_list(data) {
  return request({
    url: '/v1/k8s/deployment/plan/',
    method: 'post',
    data
  })
}
export function put_kube_deploy_list(data) {
  return request({
    url: '/v1/k8s/deployment/plan/',
    method: 'put',
    data
  })
}



export function delete_kube_deploy_list(data) {
  return request({
    url: '/v1/k8s/deployment/plan/',
    method: 'delete',
    data
  })
}
