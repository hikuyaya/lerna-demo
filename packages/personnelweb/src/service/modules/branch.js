import yid from '@src/library'

const prefix = 'api-base/branch'
const prefixChain = 'api-chain/branch'

const bindprefix = 'api-member/xxwbind'

export function list(params) {
  return yid.http.get(`${prefixChain}/list/all`, { params })
}

export function getListByShopType(params) {
  return yid.http.get(`${prefixChain}/getListByShopType`, { params })
}

export function bindcardlist(params) {
  return yid.http.get(`${bindprefix}/bindcardlist`, { params })
}

export function unbindcard(params) {
  return yid.http.get(`${bindprefix}/cleanBind`, { params })
}

export default {
  /** 部门列表 */
  list,
  getListByShopType,
  bindcardlist,
  unbindcard
}
