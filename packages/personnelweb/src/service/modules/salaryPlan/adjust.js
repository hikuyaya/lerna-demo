/*
 * @Author: wqy
 * @Date: 2022-07-29 17:20:32
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-03 17:19:04
 * @FilePath: \personnelweb\src\service\modules\salaryPlan\adjust.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeesalbill'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

// 员工固定工资项查询
export function getEmployeesalItem(params) {
  return yid.http.get(`api-pers/employeesalitem/list/all`, { params })
}

// 保存
export function save(params) {
  return yid.http.post(`${prefix}/saveSalBill`, params)
}

// 批量保存
export function batchsaveSal(params) {
  return yid.http.post(`${prefix}/batchsaveSal`, params)
}

// 批量保存并审核
export function batchaudSal(params) {
  return yid.http.post(`${prefix}/batchaudSal`, params)
}

// 单个删除
export function remove(id) {
  return yid.http.get(`${prefix}/del/${id}`, {})
}

// 导入校验
export function checkSalBill(params) {
  return yid.http.post(`${prefix}/checkSalBill`, params)
}

// 单行审核
export function audSalBill(params) {
  return yid.http.post(`${prefix}/audSalBill?id=${params.id}`, params)
}

// 批次号审核
export function batchaudSals(params) {
  return yid.http.post(
    `${prefix}/batchaudSals?batchNo=${params.batchNo}`,
    params
  )
}

// 批次号删除
export function batchDelete(params) {
  return yid.http.delete(`${prefix}/batchDelete`, { params })
}

// 根据批次号查询数量
export function queryByBatch(params) {
  return yid.http.get(`${prefix}/quyerByBatch`, { params })
}

// 员工学习金查询
export function queryEmployeesal(params) {
  return yid.http.get(`api-pers/employeesal/list/all`, { params })
}

export default {
  list,
  getEmployeesalItem,
  save,
  remove,
  checkSalBill,
  audSalBill,
  batchaudSals,
  batchaudSal,
  batchDelete,
  queryByBatch,
  queryEmployeesal
}
