/*
 * @Author: wqy
 * @Date: 2022-06-30 09:27:49
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-30 11:19:18
 * @FilePath: \personnelweb\src\service\modules\base\duty.js
 * @Description: 职务、级别设置接口
 */
import yid from '@src/library'

const prefix = 'api-chain'
// 职务列表
export function list(params) {
  return yid.http.get(`${prefix}/position/list`, { params })
}
// 级别列表
export function positionLevelList(params) {
  return yid.http.get(`${prefix}/positionlevel/list`, { params })
}
// 级别1列表
export function positionLevel1List(params) {
  return yid.http.get(`api-pers/position/level1/list`, { params })
}
export default {
  list,
  positionLevelList,
  positionLevel1List
}
