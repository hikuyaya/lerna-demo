/*
 * @Author: wqy
 * @Date: 2022-07-11 09:29:51
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-12 16:52:23
 * @FilePath: \personnelweb\src\service\modules\staff\level.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeeLevelMaintenance'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}
// 保存
export function save(params) {
  return yid.http.post(`${prefix}`, params)
}
// 查询批次号任务数量
export function countByBatchNo(batchNo) {
  return yid.http.get(`${prefix}/countByBatchNo/${batchNo}`, null)
}
// 根据批次号删除
export function deleteByBatchNo(batchNo) {
  return yid.http.delete(`${prefix}/deleteByBatchNo/${batchNo}`, null)
}
// 根据批次号审核
export function approval(batchNo) {
  return yid.http.get(`${prefix}/approval/${batchNo}`, null)
}
// 合同状态单下载模版
export function downExcel() {
  return yid.http.get(`api-pers/template/downExcel`, null)
}
// 导入
export function importData(params) {
  return yid.http.post(`${prefix}/import`, params)
}
// 根据员工编码查询员工岗位信息
export function getByEeCode(params) {
  return yid.http.get(`api-pers/userPost`, { params })
}

export default {
  list,
  save,
  countByBatchNo,
  deleteByBatchNo,
  approval,
  downExcel,
  importData,
  getByEeCode
}
