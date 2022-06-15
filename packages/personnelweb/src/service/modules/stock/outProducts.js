import yid from '@src/library'

const prefix = 'api-stock/outproducts/'
export function list(params) {
  return yid.http.get(`${prefix}list/all`, { params })
}

export function save(params) {
  return yid.http.post(`${prefix}`, params)
}

export function batchDelete(params) {
  return yid.http.post(`${prefix}/batchdelete`, params)
}

//入库单产品列表
export default {
  /** 列表 */
  list,
  save,
  /*
     根据seid 批量删除（状态）
     */
  batchDelete
}
