/*
 * @Author: wqy
 * @Date: 2022-08-18 17:02:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-18 17:03:37
 * @FilePath: \personnelweb\src\service\modules\salaryReport\shopStudyFund.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeesal'
export function list(params) {
  return yid.http.get(`${prefix}/shopXxjList`, { params })
}

export default {
  list
}
