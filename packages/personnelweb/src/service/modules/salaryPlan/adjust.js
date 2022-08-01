/*
 * @Author: wqy
 * @Date: 2022-07-29 17:20:32
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-01 09:39:26
 * @FilePath: \personnelweb\src\service\modules\salaryPlan\adjust.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeesalbill'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

// 员工学习金查询
export function getEmployeesalByCode() {
  return yid.http.get(`api-pers/employeesal/list/all`)
}

export function save(params) {
  return yid.http.post(`${prefix}/saveSalBill`, params)
}

export function remove(id) {
  return yid.http.delete(`${prefix}/DeleteMapping/${id}`, {})
}

export function validate(params) {
  return yid.http.post(`${prefix}/audSalBill`, params)
}

export default {
  list,
  getEmployeesalByCode,
  save,
  remove,
  validate
}
