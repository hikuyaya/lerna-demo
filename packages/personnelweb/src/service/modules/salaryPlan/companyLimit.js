/*
 * @Author: wqy
 * @Date: 2022-07-28 09:14:24
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 09:16:09
 * @FilePath: \personnelweb\src\service\modules\salaryPlan\companyLimit.js
 * @Description:
 */

import yid from '@src/library'

const prefix = 'api-pers/company_employee_public_salary'

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
