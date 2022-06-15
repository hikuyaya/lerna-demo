import yid from '@src/library'

const prefix = 'api-chain'

export function add(params) {
  return yid.http.post(`${prefix}/redenvelopeinfo`, params)
}

export function search(params) {
  return yid.http.get(`${prefix}/redenvelopeinfo/search`, { params })
}

export function changeStatus(params) {
  return yid.http.post(`${prefix}/redenvelopeinfo/changeStatus`, params)
}

export function queryRedenv(params) {
  return yid.http.get(`${prefix}/redenvelopeinfo/queryRedenv`, { params })
}

export default {
  add,
  search,
  //仅仅改变状态用
  changeStatus,
  queryRedenv
}
