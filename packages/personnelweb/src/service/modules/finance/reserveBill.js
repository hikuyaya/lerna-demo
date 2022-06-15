import yid from '@src/library'

const prefix = 'api-finance/reservebillhead'

export function billList(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function saveBill(params) {
  const url = `${prefix}/saveBill`
  return yid.http.post(url, params)
}

export function saveSystem(params) {
  const url = `${prefix}/saveSystem`
  return yid.http.post(url, params)
}

export function deleteBill(params) {
  const url = `${prefix}/deleteBill`
  return yid.http.post(url, params)
}

export function auditBill(params) {
  const url = `${prefix}/auditBill`
  return yid.http.post(url, params)
}

export default {
  billList,
  listAll,
  saveBill,
  saveSystem,
  deleteBill,
  auditBill
}
