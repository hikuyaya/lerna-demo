/*
 * @Author: wqy
 * @Date: 2022-07-14 16:49:58
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-14 16:55:52
 * @FilePath: \personnelweb\src\service\modules\staff\shop.js
 * @Description: 门店员工资料维护、审核
 */
import yid from '@src/library'

const prefix = 'api-pers/inductionEmployee'

// 列表
export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}
// 列表
export function getListByLoginUser(params) {
  return yid.http.get(`api-pers/employee/getListByLoginUser`, { params })
}
// 新增
export function save(params) {
  return yid.http.post(`${prefix}/inductionEmployee`, params)
}
// 修改
export function update(params) {
  return yid.http.put(`${prefix}/inductionEmployee`, params)
}
// 删除
export function remove(id) {
  return yid.http.delete(`${prefix}/inductionEmployee/${id}`, null)
}
// 详情
export function detail(id) {
  return yid.http.get(`${prefix}/${id}`, null)
}
// 通过、驳回
export function approve(params) {
  return yid.http.post(`${prefix}/approval`, params)
}

export default {
  list,
  save,
  update,
  remove,
  detail,
  approve,
  getListByLoginUser
}
