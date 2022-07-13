/*
 * @Author: wqy
 * @Date: 2022-07-13 09:45:02
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-13 14:47:05
 * @FilePath: \personnelweb\src\service\modules\staff\transferPosition.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeePostTransfer'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}
// 新增
export function save(params) {
  return yid.http.post(`${prefix}`, params)
}
// 修改
export function update(params) {
  return yid.http.put(`${prefix}`, params)
}
// 移除
export function remove(id) {
  return yid.http.delete(`${prefix}/${id}`, null)
}
// 审核
export function approval(id) {
  return yid.http.get(`${prefix}/approval/${id}`, null)
}
export default {
  list,
  save,
  update,
  remove,
  approval
}
