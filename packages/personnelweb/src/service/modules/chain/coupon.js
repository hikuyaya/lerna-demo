import yid from '@src/library'

const prefix = 'api-chain'

export function add(params) {
  return yid.http.post(`${prefix}/couponinfo`, params)
}

export function search(params) {
  return yid.http.get(`${prefix}/couponinfo/search`, { params })
}

export function changeStatus(params) {
  return yid.http.post(`${prefix}/couponinfo/changeStatus`, params)
}

export function queryCoupon(params) {
  return yid.http.get(`${prefix}/couponinfo/queryCoupon`, { params })
}

export function upImage(params) {
  return yid.http.post(`api-file/files-anon`, params)
}

export default {
  add,
  search,
  //仅仅改变状态用
  changeStatus,
  queryCoupon,
  upImage
}
