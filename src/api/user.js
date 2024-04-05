import request from '@/utils/request'
export function apiData(data) {
  return request({
    url: '/api/data',
    method: 'post',
	data
  })
}
export function convert_pdf(data) {
  return request({
    url: '/convert_pdf',
    method: 'post',
	data
  })
}
export function apiDatas(data) {
  return request({
    url: '/api/datas',
    method: 'post',
	data
  })
}
export function allcontentsapi(data) {
  return request({
    url: '/api/allcontentsapi',
    method: 'post',
	data
  })
}
export function c3(data) {
  return request({
    url: '/api/c3',
    method: 'post',
	data
  })
}

export function apiList(data) {
  return request({
    url: '/api/list',
    method: 'post',
	data
  })
}
export function apiinformation(data) {
  return request({
    url: '/api/information',
    method: 'post',
	data
  })
}
export function modeldatas(data) {
  return request({
    url: '/api/modeldatas',
    method: 'post',
	data
  })
}
export function apiAgent(data) {
  return request({
    url: '/api/agent',
    method: 'post',
	data
  })
}

