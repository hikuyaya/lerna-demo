/*
 * @Author: wqy
 * @Date: 2022-08-11 16:32:00
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-11 18:03:36
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\payRequest.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/paysalarybill'

// 薪酬打款申请单查询
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}

// 薪酬打款申请单获取名单
export function getSalaryPayEmployee(params) {
  return yid.http.get(`${prefix}/getSalaryPayEmployee`, { params })
}

// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBill`, params)
}

// 薪酬打款申请单撤回
export function revoke(params) {
  return yid.http.post(`${prefix}/undoBill`, params)
}

// 薪酬打款申请单提交
export function submit(params) {
  return yid.http.post(`${prefix}/submitBill`, params)
}

export default {
  list,
  getSalaryPayEmployee,
  save,
  revoke,
  submit
}
