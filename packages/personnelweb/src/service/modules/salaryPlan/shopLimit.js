/*
 * @Author: wqy
 * @Date: 2022-07-27 11:16:38
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-27 13:47:36
 * @FilePath: \personnelweb\src\service\modules\salaryPlan\shopLimit.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/shoppublicsalary'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function validate(params) {
  return yid.http.post(`${prefix}/validation`, params)
}

export function importExcel(params) {
  return yid.http.post(`${prefix}/importExcel`, params)
}

export default {
  list,
  save,
  validate,
  importExcel
}
