/*
 * @Author: wqy
 * @Date: 2022-08-12 10:03:57
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-15 11:25:44
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\payApprove.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/paysalarybill'

// 薪酬打款审核查询
export function list(params) {
  return yid.http.get(`${prefix}/billListForChain`, { params })
}

// 薪酬打款申请一键锁定
export function lockBills(params) {
  return yid.http.post(`${prefix}/lockBills`, params)
}

// 薪酬打款申请一键解锁
export function cancelLockBills(params) {
  return yid.http.post(`${prefix}/cancelLockBills`, params)
}

// 薪酬打款申请驳回
export function rejectBills(params) {
  return yid.http.post(`${prefix}/rejectBills`, params)
}

// 薪酬打款申请审核
export function censorBills(params) {
  return yid.http.post(`${prefix}/censorBills`, params)
}

// 薪酬打款检测取消审核
export function checkCancelCensorBill(params) {
  return yid.http.post(`${prefix}/checkCancelCensorBill`, params)
}

// 薪酬打款取消审核
export function cancelCensorBills(params) {
  return yid.http.post(`${prefix}/cancelCensorBills`, params)
}

export default {
  list,
  lockBills,
  cancelLockBills,
  rejectBills,
  censorBills,
  checkCancelCensorBill,
  cancelCensorBills
}
