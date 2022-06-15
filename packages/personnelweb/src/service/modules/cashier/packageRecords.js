import yid from '@src/library'

const prefix = 'api-cashier/packagerecords'

export function packagerecordList(params) {
  return yid.http.get(`${prefix}/chain/admin/packageRecordList`, { params })
}

export function packagerecordListSum(params) {
  return yid.http.get(`${prefix}/chain/admin/packageRecordListSum`, { params })
}

export function packagerecordyj(params) {
  return yid.http.get(`${prefix}/chain/packagerecordyj`, { params })
}

export function revokeBill(params) {
  const url = `${prefix}/chain/revoke`
  return yid.http.post(url, params)
}

export function reviseBill(params) {
  const url = `${prefix}/revise`
  return yid.http.post(url, params)
}

export function packagerecordzs(params) {
  return yid.http.get(`${prefix}/chain/packagerecordzs`, { params })
}

export function list(params) {
  return yid.http.get(`${prefix}/pageAll`, { params })
}

export default {
  /**套餐购买记录**/
  packagerecordList,
  packagerecordListSum,
  packagerecordyj,
  revokeBill,
  reviseBill,
  packagerecordzs,
  list
}
