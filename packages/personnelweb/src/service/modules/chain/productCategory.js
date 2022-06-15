import yid from '@src/library'
const prefix = 'api-chain/productcategory'

export function alllist(params) {
  return yid.http.get(`${prefix}/list/all`, { params })
}

export function allfz(params) {
  return yid.http.get(`${prefix}/list/allfz`, { params })
}
export function treeAll(params) {
  return yid.http.get(`${prefix}/tree/all`, { params })
}

export default {
  /** 产品品牌列表 */
  alllist,
  /**分级列表**/
  allfz,
  treeAll
}
