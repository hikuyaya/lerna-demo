/*
 * @Author: wqy
 * @Date: 2022-07-05 16:20:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-05 16:22:06
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

export default {
  getEducationList,
  getBankList
}
