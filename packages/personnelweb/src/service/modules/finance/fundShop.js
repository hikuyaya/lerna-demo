import yid from '@src/library'

const prefix = 'api-finance/fundshop/'
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function getFundShop(params) {
  return yid.http.post(`${prefix}/getFundShop`, params)
}

export default {
  /** 列表 */
  list,
  save,
  getFundShop
}
