/*
 * @Author: wqy
 * @Date: 2022-08-10 11:35:57
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-10 13:42:01
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\salaryApprove.js
 * @Description:
 */

import yid from '@src/library'
const prefix = 'api-pers/salary'

// 查询门店薪酬申请单
export function detail(params) {
  return yid.http.get(`${prefix}/detail`, { params })
}

// 审核锁定
export function lockApprove(id) {
  return yid.http.get(`${prefix}/${id}`, {})
}

// 计算锁定
export function lockCalculate(params) {
  return yid.http.get(`${prefix}/lockCalculator`, { params })
}

// 计算解锁
export function unLockCalculate(params) {
  return yid.http.get(`${prefix}/unLockCalculator`, { params })
}

// 发布工资
export function pushSalary(id) {
  return yid.http.get(`${prefix}/pushSalary/${id}`, {})
}

// 审批
export function approve(id) {
  return yid.http.get(`${prefix}/approval/${id}`, {})
}

// 驳回
export function reject(params) {
  return yid.http.get(`${prefix}/back`, { params })
}

// 批量审核锁定
export function batchLockApprove(params) {
  return yid.http.get(`${prefix}/batchLockApproval`, { params })
}

// 批量审批解锁
export function batchUnLockApproval(params) {
  return yid.http.get(`${prefix}/batchUnLockApproval`, { params })
}

// 批量锁定计算
export function batchLockCalculate(params) {
  return yid.http.get(`${prefix}/batchLockCalculator`, { params })
}

// 批量计算解锁
export function batchUnLockCalculate(params) {
  return yid.http.get(`${prefix}/batchUnLockCalculator`, { params })
}

// 批量驳回
export function batchBack(params) {
  return yid.http.get(`${prefix}/batchBack`, { params })
}

export default {
  detail,
  lockApprove,
  lockCalculate,
  unLockCalculate,
  pushSalary,
  approve,
  reject,
  batchLockApprove,
  batchUnLockApproval,
  batchLockCalculate,
  batchUnLockCalculate,
  batchBack
}
