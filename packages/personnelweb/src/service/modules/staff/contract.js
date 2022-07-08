/*
 * @Author: wqy
 * @Date: 2022-07-08 09:36:43
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-08 15:27:25
 * @FilePath: \personnelweb\src\service\modules\staff\contract.js
 * @Description: 合同状态维护
 */
import yid from '@src/library'

const prefix = 'api-pers/employeecontractmaintenance'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/billList`, { params })
}
// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveBills`, params)
}
// 合同状态单批次数量查询
export function getBillsByBatchNo(params) {
  return yid.http.get(`${prefix}/getBillsByBatchNo`, { params })
}
// 合同状态单批次删除
export function deleteBillByBatchNo(params) {
  return yid.http.get(`${prefix}/deleteBillByBatchNo`, { params })
}
// 合同状态单批次审核
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
  list,
  save,
  getBillsByBatchNo,
  deleteBillByBatchNo,
  censorBillByBatchNo,
  downSysTemplate,
  convertSystem,
  saveBillsAndCensor
}
