import yid from '@src/library'

const prefix = 'api-member/couponinfo'

export function getCouponRecordForChain(params) {
  return yid.http.get(`${prefix}/chain/list/records`, { params })
}

export default {
  getCouponRecordForChain
}
