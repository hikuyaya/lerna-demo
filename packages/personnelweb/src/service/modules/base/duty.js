/*
 * @Author: wqy
 * @Date: 2022-06-30 09:27:49
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-01 14:53:03
 * @FilePath: \personnelweb\src\service\modules\base\duty.js
 * @Description: 职务、级别设置接口
 */
import yid from '@src/library'

// 职务列表
export function list(params) {
  return yid.http.get(`api-chain/position/list`, { params })
}
// 级别列表
export function positionLevelList(params) {
  return yid.http.get(`api-chain/positionlevel/list`, { params })
}
// 级别1列表
export function positionLevel1List(params) {
  return yid.http.get(`api-pers/position/level1/list`, { params })
}
// 职务级别维护
export function positionLevelOperate(params) {
  return yid.http.post(`api-pers/position/level1/operation`, params)
}
// 启用禁用职务
// export function updateStatus(params) {
//   return yid.http.post(`api-pers/position/level1/updateStatus`, params)
// }
// 启用禁用职务
export function updateStatus(params) {
  return yid.http.post(`api-chain/position/updateStatus`, params)
}
export default {
  list,
  positionLevelList,
  positionLevel1List,
  positionLevelOperate,
  updateStatus
}
