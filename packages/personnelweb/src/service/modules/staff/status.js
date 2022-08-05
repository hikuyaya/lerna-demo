/*
 * @Author: wqy
 * @Date: 2022-07-11 14:03:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-05 09:39:17
 * @FilePath: \personnelweb\src\service\modules\staff\status.js
 * @Description: 员工状态维护
 */
import yid from '@src/library'

const prefix = 'api-pers/employeestatemaintenance'

// 列表
export function billList(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}
// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBills`, params)
}
// 员工状态维护单批次数量查询
export function getBillsByBatchNo(params) {
  return yid.http.get(`${prefix}/getBillsByBatchNo`, { params })
}
// 员工状态维护单按批次删除
export function deleteBillByBatchNo(params) {
  return yid.http.get(`${prefix}/deleteBillByBatchNo`, { params })
}
// 员工状态维护单按批次审核
export function censorBillByBatchNo(params) {
  return yid.http.get(`${prefix}/censorBillByBatchNo`, { params })
}
// 合同状态单下载模版
export function downSysTemplate() {
  return yid.http.get(`${prefix}/downSysTemplate`, null)
}
// 合同状态单导入上传
export function convertSystem(params) {
  return yid.http.post(`${prefix}/convertSystem`, params)
}
// 合同状态单保存并审核
export function saveBillsAndCensor(params) {
  return yid.http.post(`${prefix}/saveBillsAndCensor`, params)
}

export default {
  billList,
  list,
  save,
  getBillsByBatchNo,
  deleteBillByBatchNo,
  censorBillByBatchNo,
  downSysTemplate,
  convertSystem,
  saveBillsAndCensor
}
