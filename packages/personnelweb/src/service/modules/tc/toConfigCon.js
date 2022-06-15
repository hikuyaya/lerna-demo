import yid from '@src/library'

const prefix = 'api-pers/'

//  获取提成分类字典数据
export function rType() {
  return yid.http.get(`${prefix}/royaltytype/list/all`)
}

//  获取提成方案中的项目列表
export function itemList(prmid) {
  return yid.http.get(`${prefix}/royaltyitem/list/${prmid}`)
}

//  修改提成项目组成的状态
export function updateItemStatus(param) {
  return yid.http.post(`${prefix}/royaltyitem/`, param)
}

//  新增提成项目组成
export function addItem(param) {
  return yid.http.post(`${prefix}/royaltyitem/new`, param)
}

export default {
  /** 获取提成方案管理分页 */
  rType,
  /**获取提成方案中的项目列表*/
  itemList,
  /**修改提成项目组成的状态*/
  updateItemStatus,
  /** 新增提成项目组成 */
  addItem
}
