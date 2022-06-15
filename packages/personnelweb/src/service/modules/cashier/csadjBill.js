import yid from '@src/library'

const prefix = 'api-cashier/csadjrecords'

export function csadjRecordList(params) {
  return yid.http.get(`${prefix}/list/listBypageForChain`, { params })
}

export function getCsadjBillForSaas(billcode) {
  return yid.http.get(`${prefix}/getCsadjBillForSaas/${billcode}`)
}

export function list(params) {
  return yid.http.get(`${prefix}/pageAll`, { params })
}

export default {
  /**管理端-充值调整单记录**/
  csadjRecordList,
  getCsadjBillForSaas,
  list
}
