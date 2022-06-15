import yid from '@src/library'

const prefix = 'api-stock/out/'
export function list(params) {
  return yid.http.get(`${prefix}chain/findListWithPro`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function audit(params) {
  return yid.http.post(`${prefix}audit`, params)
}

export function revoke(params) {
  return yid.http.post(`${prefix}revoke`, params)
}

export function reject(params) {
  return yid.http.post(`${prefix}reject`, params)
}

//出库单产品列表
export default {
  /** 列表 */
  list,
  save,
  audit,
  revoke,
  reject
}
