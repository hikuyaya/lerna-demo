/*
 * @Author: wqy
 * @Date: 2022-08-10 09:58:49
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 10:03:07
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\specialApprove.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/specsalarybill'

// 特殊工资申请查询（总部）
export function list(params) {
  return yid.http.get(`${prefix}/billListForChain`, { params })
}

// 特殊工资申请审核（总部）
export function approve(params) {
  return yid.http.post(`${prefix}/auditBill`, params)
}

// 特殊工资申请一键审核（总部）
export function approveAll(params) {
  return yid.http.post(`${prefix}/auditBillAll`, params)
}

// 特殊工资申请驳回（总部）
export function reject(params) {
  return yid.http.post(`${prefix}/rejectBill`, params)
}

export default {
  list,
  approve,
  reject,
  approveAll
}
