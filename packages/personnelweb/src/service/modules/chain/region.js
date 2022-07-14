/*
 * @Author: wqy
 * @Date: 2022-06-15 14:05:18
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-14 09:22:52
 * @FilePath: \personnelweb\src\service\modules\chain\region.js
 * @Description:
 */
import yid from '@src/library'

const prefix = 'api-chain/dictregion'

export function listAll(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function list(params) {
  return yid.http.get(`${prefix}`, { params })
}

export function treeAll(params) {
  return yid.http.get(`${prefix}/tree/all`, { params })
}

export function treeAllNoNum(params) {
  return yid.http.get(`${prefix}/tree/allNoNum`, { params })
}

export function treeTwo(params) {
  return yid.http.get(`${prefix}/tree/two`, { params })
}

export function saveRegion(params) {
  const url = `${prefix}/saveRegionNew`
  return yid.http.post(url, params)
}

export function getRegionByid(id) {
  const url = `${prefix}/${id}`
  return yid.http.get(url)
}

export function shopTree() {
  return yid.http.get(`${prefix}/shopTree`)
}

export default {
  list,
  listAll,
  /**查询区域树结构**/
  treeAll,
  /**查询区域树结构**/
  treeAllNoNum,
  /**查询区域树结构(二级)**/
  treeTwo,
  /**保存或修改区域**/
  saveRegion,
  /**通过id查询区域**/
  getRegionByid,
  /*区域+门店树*/
  shopTree
}
