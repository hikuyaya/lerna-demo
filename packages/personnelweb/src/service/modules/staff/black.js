/*
 * @Author: wqy
 * @Date: 2022-07-05 10:34:49
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-05 10:39:04
 * @FilePath: \personnelweb\src\service\modules\staff\black.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-pers/employeeblacklist'
// 查询黑名单列表
export function list(params) {
  return yid.http.get(`${prefix}/list`, { params })
}
// 添加黑名单
export function save(params) {
  return yid.http.post(`${prefix}/saveBlackInfo`, params)
}
// 移除黑名单
export function remove(params) {
  return yid.http.post(`${prefix}/removeBlackInfo`, params)
}

export default {
  list,
  save,
  remove
}
