/*
 * @Author: wqy
 * @Date: 2022-08-02 11:20:20
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-07 09:39:42
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\attendance.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/workattendancedaybill'

// 考勤天数录入单列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function update(params) {
  return yid.http.put(`${prefix}`, params)
}

export function recalculate() {
  return yid.http.get(`${prefix}/recalculate`, {})
}

// 门店获取工资条名单列表
export function getEmployeeList(params) {
  return yid.http.get(`${prefix}/getEmployeeList`, { params })
}

// 导入校验
export function validate(params) {
  return yid.http.post(`${prefix}/validation`, params)
}

export function approve(params) {
  return yid.http.get(`${prefix}/approval`, { params })
}

export function detail(id) {
  return yid.http.get(`${prefix}/${id}`, {})
}

// 查询固定工资明细
export function getByEeCode(params) {
  return yid.http.get(`${prefix}/getByEeCode`, { params })
}

export default {
  list,
  save,
  update,
  getEmployeeList,
  validate,
  recalculate,
  approve,
  detail,
  getByEeCode
}
