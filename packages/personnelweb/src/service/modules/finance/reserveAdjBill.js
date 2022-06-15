import yid from '@src/library'

const prefix = 'api-finance/reserveadjbillhead'

export function billListForChain(params) {
  return yid.http.get(`${prefix}/billListForChain`, { params })
}

export function auditBillsp(params) {
  const url = `${prefix}/auditBillsp`
  return yid.http.post(url, params)
}

export function auditBillfh(params) {
  const url = `${prefix}/auditBillfh`
  return yid.http.post(url, params)
}

export function rejectBill(params) {
  const url = `${prefix}/rejectBill`
  return yid.http.post(url, params)
}

export default {
  /** 列表 */
  billListForChain,
  auditBillsp,
  auditBillfh,
  rejectBill
}
