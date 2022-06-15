import yid from '@src/library'

const prefix = 'api-pers/checkrecords'

export function getRecordsList(params) {
  return yid.http.get(`${prefix}/getRecordsList`, { params })
}

export function editBc(params) {
  const url = `${prefix}/editBc`
  return yid.http.post(url, params)
}

export function editKq(params) {
  const url = `${prefix}/editKq`
  return yid.http.post(url, params)
}

export function editStatus(params) {
  const url = `${prefix}/editStatus`
  return yid.http.post(url, params)
}
//补卡
export function bkSignIn(params) {
  const url = `${prefix}/bkSignIn`
  return yid.http.post(url, params)
}

//考勤月表查询
export function getShopMonthRecords(params) {
  return yid.http.get(`${prefix}/getShopMonthRecords`, { params })
}

//考勤月表 所有人班次查询
export function getShopEeScheduleList(params) {
  return yid.http.get(`api-pers/employeeschedule/shopEeScheduleList`, {
    params
  })
}

export default {
  /**考勤记录**/
  getRecordsList,
  /**修改班次**/
  editBc,
  /**修改考勤**/
  editKq,
  /**修改打卡状态**/
  editStatus,
  bkSignIn,
  /**考勤月表查询**/
  getShopMonthRecords,
  getShopEeScheduleList
}
