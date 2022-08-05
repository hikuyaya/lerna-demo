/*
 * @Author: wqy
 * @Date: 2022-08-05 10:45:48
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-05 14:21:18
 * @FilePath: \personnelweb\src\service\modules\studyFund\leave.js
 * @Description:
 */

import yid from '@src/library'

const prefix = 'api-pers/eexxjadjbill'

export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

export function impData(params) {
  return yid.http.post(`${prefix}/impData`, params)
}

// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBill`, params)
}

// 保存审核
export function saveSudBill(params) {
  return yid.http.post(`${prefix}/saveSudBill`, params)
}

// 批次号查询
export function batchQuery(params) {
  return yid.http.get(`${prefix}/batchQuery`, { params })
}

// 批次审核
export function batchAduBill(params) {
  return yid.http.post(`${prefix}/batchAduBill`, params)
}

// 批次删单
export function batchDelBill(params) {
  return yid.http.get(`${prefix}/batchDelBill`, { params })
}

export default {
  list,
  impData,
  save,
  saveSudBill,
  batchQuery,
  batchAduBill,
  batchDelBill
}
