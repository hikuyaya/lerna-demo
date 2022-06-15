import yid from '@src/library'

const prefix = 'api-finance/fundhcbill'

export function billList(params) {
  return yid.http.get(`${prefix}/billListChain`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveBill(params) {
  const url = `${prefix}/saveBill`
  return yid.http.post(url, params)
}

export function deleteBill(params) {
  const url = `${prefix}/deleteBill`
  return yid.http.post(url, params)
}

export function auditFhBill(params) {
  const url = `${prefix}/auditFhBill`
  return yid.http.post(url, params)
}

export function cancelFhBill(params) {
  const url = `${prefix}/cancelFhBill`
  return yid.http.post(url, params)
}

export function rejectBill(params) {
  const url = `${prefix}/rejectBill`
  return yid.http.post(url, params)
}

export function queryFundShop(params) {
  return yid.http.post(`api-finance/fundshop/queryFundShop`, params)
}

export default {
  billList,
  listAll,
  saveBill,
  queryFundShop,
  deleteBill,
  auditFhBill,
  rejectBill,
  cancelFhBill
}
