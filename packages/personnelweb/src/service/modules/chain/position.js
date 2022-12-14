/*
 * @Author: wqy
 * @Date: 2022-06-15 14:05:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-28 16:49:08
 * @FilePath: \personnelweb\src\service\modules\chain\position.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-chain/position'
export function list(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function all() {
  return yid.http.get(`${prefix}/list/all`)
}

export function tree(params) {
  return yid.http.get(`${prefix}/list/tree`, { params })
}

export default {
  /** 职务列表 */
  list,
  tree,
  all
}
