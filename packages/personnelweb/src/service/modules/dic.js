/*
 * @Author: wqy
 * @Date: 2022-07-05 16:20:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-14 15:00:32
 * @FilePath: \personnelweb\src\service\modules\dic.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/dic'

// 学历字典
export function getEducationList() {
  return yid.http.get(`${prefix}/getEducationList`, null)
}
// 银行字典
export function getBankList() {
  return yid.http.get(`${prefix}/getBackList`, null)
}
// 入职渠道
export function getInductionwayList() {
  return yid.http.get(`${prefix}/getInductionwayList`, null)
}
// 离职原因
export function getStatusReasonList() {
  return yid.http.get(`${prefix}/getStatusReasonList`, null)
}

export default {
  getEducationList,
  getBankList,
  getInductionwayList,
  getStatusReasonList
}
