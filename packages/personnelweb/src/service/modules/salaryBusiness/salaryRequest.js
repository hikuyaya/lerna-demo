/*
 * @Author: wqy
 * @Date: 2022-08-06 09:11:02
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-06 17:31:18
 * @FilePath: \personnelweb\src\service\modules\salaryBusiness\salaryRequest.js
 * @Description:
 */
import yid from '@src/library'
const prefix = 'api-pers/salaryapplybill'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}

// 详情
export function detail(id) {
  return yid.http.get(`${prefix}/${id}`, {})
}

// 门店获取薪酬名单
export function getApplyEmployeeList(params) {
  return yid.http.get(`${prefix}/getApplyEmployeeList`, { params })
}

// 新增
export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

// 修改
export function update(params) {
  return yid.http.put(`${prefix}`, params)
}

// 撤回
export function revoke(id) {
  return yid.http.get(`${prefix}/recall/${id}`, {})
}

export default {
  list,
  detail,
  getApplyEmployeeList,
  save,
  update,
  revoke
}
