/*
 * @Author: wqy
 * @Date: 2022-07-01 15:59:19
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-31 09:42:10
 * @FilePath: \lerna-demod:\project\personnelweb\src\service\modules\base\station.js
 * @Description: 岗位设置
 */
import yid from '@src/library'

const prefix = 'api-pers/post'

// 查询岗位列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}
// 新增岗位
export function save(params) {
  return yid.http.post(`${prefix}`, params)
}
// 修改岗位
export function update(params) {
  return yid.http.put(`${prefix}`, params)
}
// 查询岗位详情
export function detail(id) {
  return yid.http.get(`${prefix}/${id}`, null)
}
// 删除岗位
export function remove(id) {
  return yid.http.delete(`${prefix}/${id}`, null)
}
// 根据组织类型查询对应职务
export function listByType(params) {
  return yid.http.get(`api-chain/position/listByType`, { params })
}

export default {
  list,
  save,
  update,
  detail,
  remove,
  listByType
}
