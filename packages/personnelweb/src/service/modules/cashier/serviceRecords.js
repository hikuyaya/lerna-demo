import yid from '@src/library'

const prefix = 'api-cashier/servicerecords'

export function servicerecordList(params) {
  return yid.http.get(`${prefix}/chain/admin/servicerecordList`, { params })
}

export function servicerecordListOver(params) {
  return yid.http.get(`${prefix}/admin/servicerecordListOver`, { params })
}

export function servicrecordyj(params) {
  return yid.http.get(`${prefix}/chain/servicrecordyj`, { params })
}

export function saveOrUpdate(params) {
  const url = `${prefix}/saveOrUpdate`
  return yid.http.post(url, params)
}

export function revokeBill(params) {
  const url = `${prefix}/chain/revoke`
  return yid.http.post(url, params)
}

export function reviseBill(params) {
  const url = `${prefix}/revise`
  return yid.http.post(url, params)
}

export function cancel(params) {
  const url = `${prefix}/chain/mainPage/cancel`
  return yid.http.post(url, params)
}

export function list(params) {
  return yid.http.get(`${prefix}/pageAll`, { params })
}

export default {
  /**服务单记录**/
  servicerecordList,
  /**服务单记录（过期和作废）**/
  servicerecordListOver,
  /**服务单业绩明细**/
  servicrecordyj,
  saveOrUpdate,
  revokeBill,
  reviseBill,
  /**作废单据**/
  cancel,
  list
}
