/*
 * @Author: wqy
 * @Date: 2022-07-06 10:05:03
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-07 13:48:09
 * @FilePath: \personnelweb\src\service\modules\staff\entry.js
 * @Description: 入职申请相关
 */
import yid from '@src/library'

const prefix = 'api-pers/inductionEmployeeBaseInfo'

// 查询入职申请列表
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
// 删除
export function remove(id) {
  return yid.http.delete(`${prefix}/${id}`, null)
}
// 详情
export function detail(id) {
  return yid.http.get(`${prefix}/${id}`, null)
}
// 审核
export function approve(id) {
  return yid.http.get(`${prefix}/review/${id}`, null)
}

export default {
  list,
  save,
  update,
  remove,
  detail,
  approve
}
