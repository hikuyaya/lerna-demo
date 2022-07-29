/*
 * @Author: wqy
 * @Date: 2022-07-29 13:50:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-29 13:50:36
 * @FilePath: \personnelweb\src\service\modules\salaryPlan\payslip.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/monthrpthreesal'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export default {
  list,
  save
}
