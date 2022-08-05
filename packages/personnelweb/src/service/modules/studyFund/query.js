/*
 * @Author: wqy
 * @Date: 2022-08-04 10:09:17
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-05 14:54:46
 * @FilePath: \personnelweb\src\service\modules\studyFund\query.js
 * @Description:
 */
import yid from '@src/library'

// 学习金日志
export function eexxjlogList(params) {
  return yid.http.get(`api-pers/eexxjlog/list`, { params })
}
export default {
  eexxjlogList
}
