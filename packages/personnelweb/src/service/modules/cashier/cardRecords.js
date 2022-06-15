import yid from '@src/library'

const prefix = 'api-cashier/cardrecords'

export function cardRecordList(params) {
  return yid.http.get(`${prefix}/chain/admin/cardRecordsList`, { params })
}

export function cardRecordsListSum(params) {
  return yid.http.get(`${prefix}/chain/admin/cardRecordsListSum`, { params })
}

export function cardrecordyj(params) {
  return yid.http.get(`${prefix}/chain/cardrecordyj`, { params })
}

export function recall(params) {
  const url = `${prefix}/chain/recall`
  return yid.http.post(url, params)
}

export function reviseBill(params) {
  const url = `${prefix}/revise`
  return yid.http.post(url, params)
}

export function list(params) {
  return yid.http.get(`${prefix}/pageAll`, { params })
}

export function revokeMktBill(params) {
  const url = `${prefix}/chain/revokeMktBill`
  return yid.http.post(url, params)
}

export default {
  /**管理端-开卡充值记录**/
  cardRecordList,
  cardRecordsListSum,
  cardrecordyj,
  recall,
  reviseBill,
  list,
  revokeMktBill
}
