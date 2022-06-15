import yid from '@src/library'

const prefix = 'api-pers/'

//  获取提成分类字典数据
export function normList(params) {
  return yid.http.get(`${prefix}/royaltynorm/list/vo`, { params: params })
}

//  获取提成管理项完整数据
export function getFullItem(id) {
  return yid.http.get(`${prefix}/royaltyitem/vo/${id}`)
}

//  结构体
export function structure() {
  return yid.http.get(`${prefix}/royaltyitem/structure`)
}

//  结构体
export function save(item) {
  return yid.http.post(`${prefix}/royaltyitem/item`, item)
}

export default {
  //获取提成分类字典数据
  normList,
  //获取提成管理项完整数据
  getFullItem,
  //结构体
  structure,
  //保存
  save
}
